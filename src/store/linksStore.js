import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

import { generalStore } from '@/store/generalStore'
import { joinNotesLinksStore } from '@/store/joinNotesLinksStore'

const supabase = useSupabase()

export const linksStore = {
  state: reactive({
    links: [],
  }),

  _findLinksByNoteId({ noteId }) {
    const joins = joinNotesLinksStore.state.joinNotesLinks.filter(join => join.note_id === noteId)
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

  async linksInsert({ urlArray = [], noteId = null }) {
    // Update existing links
    await this.linksFetch()

    // Prepare new links
    const preparedData = [],
          preparedJoins = []
    for (const newVal of urlArray) {
      const existingLink = this.state.links.find(link => link.url === newVal)
      if (existingLink) {
        preparedJoins.push({ note_id: noteId, link_id: existingLink.id })
        continue
      }
      
      // Fetch metadata
      let metadata
      try {
        const metadataAPIUrl = 'https://netlify-functions-madebyfabian.netlify.app/.netlify/functions/meta-fetcher?url=' + newVal
        const metadataRes = await fetch(metadataAPIUrl)
        const json = await metadataRes.json()
        metadata = json?.metadata

      } catch (error) {
        console.error(error)
      }

      preparedData.push({
        url: newVal,
        title: metadata?.title || null,
        banner_url: metadata?.banner || null,
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
      preparedJoins.push(...data.map(link => ({ note_id: noteId, link_id: link.id })))
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
    if (error) console.error(error)

    // Remove deleted links from state
    this.state.links = this.state.links.filter(link => !urlArray.includes(link.url))
  },
}