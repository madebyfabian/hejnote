import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

import generalStore from '@/store/generalStore'
import joinNotesLinksStore from '@/store/joinNotesLinksStore'
import isImageValid from '@/utils/isImageValid'
import fetchUrlMetadata from '@/utils/fetchUrlMetadata'
import handleError from '@/utils/handleError'

const supabase = useSupabase()


export default {
  state: reactive({
    links: [],
  }),

  getLinkDefaultDataObject({ link } = {}) { return {
    id: 				    link?.id || undefined,
    owner_id:       generalStore.state.user.id,
    url:            link.url,
    title:          link?.title || null,
    banner_url:     link?.banner_url || null,
  }},

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

  /**
   * This action does two things
   * - it upserts all the links given links that are not already stored in the DB.
   * - it updates/creates all the joinNotesLinks
   * @param {Array<Object>} linkObjArr Use this only together with `getLinkDefaultDataObject`
   */
  async linksUpsert({ linkObjArr = [], noteId = null, joinNotesLinksObj = { annotation: null, is_added_from_text: true, is_in_text: false } } = {}) {
    try {
      // Update existing links
      await this.linksFetch()

      // Filter out duplicates from the linkObjArr
      linkObjArr = linkObjArr.filter(( linkObj, key ) => linkObjArr.findIndex(t => (t.url === linkObj.url)) === key)

      // Prepare the links data
      const preparedLinkData = []
      for (const linkObj of linkObjArr) {
        const existingLink = this.state.links.find(link => link.url === linkObj.url)
        const preparedLinkObj = { ...linkObj, owner_id: generalStore.state.user.id }

        if (!existingLink) {
          // Link does not exist in store, so fetch metadata.
          const metadata = await fetchUrlMetadata({ url: linkObj.url })
          preparedLinkObj.title = metadata?.title || null
          preparedLinkObj.banner_url = (await isImageValid({ url: metadata?.banner })) ? metadata.banner : null
        } else {
          preparedLinkObj.id = existingLink.id
        }

        preparedLinkData.push(preparedLinkObj)
      }

      const preparedLinkDataNewLinks = preparedLinkData.filter(link => !link.id)

      // Step 1: insert links data into DB.
      let linksUpsertResult = []
      if (preparedLinkDataNewLinks.length) {
        // insert into db.
        const { data, error } = await supabase
          .from('links')
          .upsert(preparedLinkDataNewLinks, { onConflict: 'url' })
        if (error) throw new Error(error)

        // Update local state
        this.state.links.push(...data)

        linksUpsertResult.push(...data)
      }

      // Step 2: insert/update joinNotesLinks data into DB.
      joinNotesLinksStore.joinNotesLinksInsert({ newVals: preparedLinkData.map(linkObj => {
        const newLinkId = linkObj?.id || linksUpsertResult.find(link => link.url === linkObj.url)?.id
        if (!newLinkId) 
          throw new Error('Error adding links, please try again.')

        return { ...joinNotesLinksObj, note_id: noteId, link_id: newLinkId }
      }) })

    } catch (error) {
      handleError(error)
    }
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
    await joinNotesLinksStore.joinNotesLinksDelete({ joinIds: joinsToDelete.map(join => join.id) }) 

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