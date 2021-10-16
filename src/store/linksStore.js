import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

import generalStore from '@/store/generalStore'
import joinNotesLinksStore from '@/store/joinNotesLinksStore'
import isImageValid from '@/utils/isImageValid'
import fetchUrlMetadata from '@/utils/fetchUrlMetadata'

const supabase = useSupabase()


export default {
  state: reactive({
    links: [],
  }),

  _findLinksByNoteId({ noteId }) {
    const joins = joinNotesLinksStore.state.joinNotesLinks.filter(join => join.note_id === noteId)
    return joins.map(join => {
      return this.state.links.find(link => link.id === join.link_id)
    })
  },

  _findLinksByNoteIdsV2({ noteIds }) {
    const joins = joinNotesLinksStore.findJoinNotesLinksByNoteIds({ noteIds })
    return joins.map(join => {
      return this.state.links.find(link => link.id === join.link_id)
    })
  },

  async linksFetch() {
    const { data, error } = await supabase
      .from('links')
      .select('*')

    if (error)
      console.error(error)

    this.state.links = data
  },

  async linksInsert({ urlArray = [], noteId = null, isAddedFromText }) {
    if (typeof isAddedFromText !== 'boolean')
      return console.error('linksInsert: cancel because isAddedFromText is not set/not a boolean value.')

    // Update existing links
    await this.linksFetch()

    // Prepare new links
    const preparedData = [],
          preparedJoins = []
    for (const newVal of urlArray) {
      const existingLink = this.state.links.find(link => link.url === newVal)
      if (existingLink) {
        preparedJoins.push({ 
          note_id: noteId, 
          link_id: existingLink.id,
          is_added_from_text: isAddedFromText,
          is_in_text: true,
        })
        continue
      }
      
      const metadata = await fetchUrlMetadata({ url: newVal })
      const banner = (await isImageValid({ url: metadata?.banner })) ? metadata.banner : null

      preparedData.push({
        url: newVal,
        title: metadata?.title || null,
        banner_url: banner || null,
        owner_id: generalStore.state.user.id
      })
    }

    // If there are new links to insert into the DB, do this first.
    if (preparedData.length !== 0) {
      // Insert into database
      const { data, error } = await supabase
        .from('links')
        .insert(preparedData)
      if (error) console.error(error)

      // Update local state
      this.state.links.push(...data)

      // Update joins
      preparedJoins.push(...data.map(link => ({ 
        note_id: noteId, 
        link_id: link.id,
        is_added_from_text: isAddedFromText,
        is_in_text: true,
      })))
    }

    // Then, if there are some new joins to insert, do it.
    if (preparedJoins.length !== 0) {
      joinNotesLinksStore.joinNotesLinksInsert({ newVals: preparedJoins })
    }
  },

  async linksDelete({ urlArray, noteId }) {
    let linkIdsToDelete = await joinNotesLinksStore.joinNotesLinksDelete({ urlArray, noteId })

    // Now we have to delete the links from the DB.
    // To avoid some supabase errors, we need to check if they are used by other joinNotesLinks.
    const linkIdsNotToDelete = joinNotesLinksStore.state.joinNotesLinks
      .filter(join => linkIdsToDelete.includes(join.link_id))
      .map(join => join.link_id)

    // Then filter the links to delete with the ones that are not to be deleted.
    linkIdsToDelete = linkIdsToDelete.filter(linkId => !linkIdsNotToDelete.includes(linkId))
    
    // Delete the joins from the DB
    const { error } = await supabase
      .from('links')
      .delete()
      .in('id', linkIdsToDelete)
    if (error) return console.error(error)

    // Remove deleted links from state
    this.state.links = this.state.links.filter(link => !linkIdsToDelete.includes(link.id))
  },

  async linksDeleteV2({ urlArray, noteIds }) {
    // First get all links of the notes
    // if urlArray is defined, inlcude only those.
    let linkIdsToDelete = this._findLinksByNoteIdsV2({ noteIds })
      .filter(link => urlArray ? urlArray.includes(link.url) : true)
      .map(link => link.id)

    // Then find the joins to delete, only if the joins are
    // - included in the noteIds array
    // - and the urls are included in the urlArray
    const joinsToDelete = joinNotesLinksStore.state.joinNotesLinks
      .filter(join => noteIds.includes(join.note_id) && linkIdsToDelete.includes(join.link_id))

    // Then, get all the links that should be deleted and are not used by other notes.
    const linksToDelete = linkIdsToDelete.filter(linkId => joinsToDelete.some(join => join.link_id === linkId))
    const linkIdsNotToDelete = joinNotesLinksStore.state.joinNotesLinks
      .filter(join => !noteIds.includes(join.note_id))
      .map(join => join.link_id)
    linkIdsToDelete = linksToDelete.filter(linkId => !linkIdsNotToDelete.includes(linkId)).map(linkId => linkId)

    // Delete all joins
    await joinNotesLinksStore.joinNotesLinksDeleteV2({ joinsToDelete }) 

    // Delete all links
    if (linkIdsToDelete.length) {
      const { error } = await supabase
        .from('links')
        .delete()
        .in('id', linkIdsToDelete)
      if (error) console.error(error)
    }
  },
}