import { reactive, computed } from 'vue'
import { definitions } from '@/../types/supabase'
import useSupabase from '@/hooks/useSupabase'

import generalStore from '@/store/generalStore'
import joinNotesLinksStore, { JoinNotesLinksInsertParams, JoinNotesLinksUpdateParams } from '@/store/joinNotesLinksStore'
import isImageValid from '@/utils/isImageValid'
import fetchUrlMetadata from '@/utils/fetchUrlMetadata'
import handleError from '@/utils/handleError'

type Note = definitions['notes']
type Link = definitions['links']
type LinkOptional = Partial<Link>

const supabase = useSupabase()
const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
  state: reactive({
    links: [] as Link[],
  }),

  getLinkDefaultDataObject({ link } = {} as { link: LinkOptional }) { return <Link>{
    id: 				link?.id || undefined,
    owner_id:   generalStore.getUserId(),
    url:        link.url,
    title:      link?.title || undefined,
    banner_url: link?.banner_url || undefined,
    is_hidden:  isHiddenMode.value,
  }},

  _findLinksByNoteIdsV2({ noteIds }: { noteIds: Note['id'][] }) {
    const joins = joinNotesLinksStore.findJoinNotesLinksByNoteIds({ noteIds })
    const links: Link[] = []
    for (const join of joins) {
      const link = this.state.links.find(link => link.id === join.link_id)
      if (link) 
        links.push(link)
    }

    return links
  },

  async linksFetch({ fetchHidden = false } = {}) {
    const { data, error } = await supabase
      .from<Link>('links')
      .select('*')
      .eq('is_hidden', fetchHidden)

    if (error || data === null)
      return console.error(error)

    this.state.links = data
  },

  async linksUpdateHiddenState({ noteId, is_hidden }: { noteId: Note['id'], is_hidden: boolean }) {
    // First, get all joins by noteId and update the is_hidden state of all
    const joinNotesLinks = joinNotesLinksStore.findJoinNotesLinksByNoteIds({ noteIds: [ noteId ] })
    const joinIds = joinNotesLinks.map(join => join.id)

    // Then, update each join's is_hidden state
    joinNotesLinksStore.joinNotesLinksUpdate({ joinIds, noteId: noteId, newVal: { is_hidden }})

    // Finally, update the is_hidden state of the links itself
    const links = this._findLinksByNoteIdsV2({ noteIds: [ noteId ] })
    const linkIds = links.map(link => link.id)

    const { error } = await supabase
      .from<Link>('links')
      .update({ is_hidden }, { returning: 'minimal' })
      .in('id', linkIds)

    if (error)
      console.error(error)

    // Missing: Local state update, because hard to implement and not really needed.
  },

  /**
   * This action does two things
   * - it upserts all the links given links that are not already stored in the DB.
   * - it updates/creates all the joinNotesLinks
   * @param linkObjArr Use this only together with `getLinkDefaultDataObject`
   */
  async linksUpsert({ 
    linkObjArr = [], 
    noteId = null, 
    joinNotesLinksObj = { annotation: undefined, is_added_from_text: true, is_in_text: false, is_hidden: false } 
  }: {
    linkObjArr: Link[],
    noteId: Note['id'] | null,
    joinNotesLinksObj?: JoinNotesLinksUpdateParams
  }) {
    try {
      // Update existing links, remove this when realtime
      await this.linksFetch({ fetchHidden: isHiddenMode.value })

      // Filter out duplicates from the linkObjArr
      linkObjArr = linkObjArr.filter(( linkObj, key ) => linkObjArr.findIndex(t => (t.url === linkObj.url)) === key)

      // Prepare the links data
      const preparedLinkData = []
      for (const linkObj of linkObjArr) {
        const existingLink = this.state.links.find(link => link.url === linkObj.url)
        const preparedLinkObj = { ...linkObj }

        if (!existingLink) {
          // Link does not exist in store, so fetch metadata.
          const metadata = await fetchUrlMetadata({ url: linkObj.url })
          if (metadata?.title)
            preparedLinkObj.title = metadata.title

          // Check if the link is an image and get validated url
          if (metadata?.banner) {
            const { validatedUrl } = await isImageValid({ url: metadata.banner })
            if (validatedUrl && typeof validatedUrl === 'string')
              preparedLinkObj.banner_url = validatedUrl
          }
          
        } else {
          preparedLinkObj.id = existingLink.id
        }

        preparedLinkData.push(preparedLinkObj)
      }

      const preparedLinkDataNewLinks = preparedLinkData.filter(link => !link.id)

      // Step 1: insert links data into DB.
      let linksUpsertResult: Link[] = []
      if (preparedLinkDataNewLinks.length) {
        // insert into db.
        const { data, error } = await supabase
          .from<Link>('links')
          .upsert(preparedLinkDataNewLinks, { onConflict: 'url' })
        if (error || data === null) throw error

        // Update local state
        this.state.links.push(...data)

        linksUpsertResult.push(...data)
      }

      // Step 2: insert/update joinNotesLinks data into DB.
      const preparedJoinNotesLinksData = preparedLinkData.map(linkObj => {
        const newLinkId = linkObj?.id || linksUpsertResult.find(link => link.url === linkObj.url)?.id
        if (!newLinkId) 
          throw new Error('Error adding links, please try again.')

        return { ...joinNotesLinksObj, note_id: noteId, link_id: newLinkId } as JoinNotesLinksInsertParams
      })
      joinNotesLinksStore.joinNotesLinksInsert({ newVals: preparedJoinNotesLinksData })

    } catch (error) {
      handleError(error)
    }
  },

  async linksDeleteV2({ urlArray, noteIds }: { urlArray: string[], noteIds: Note['id'][] }) {
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
        .from<Link>('links')
        .delete({ returning: 'minimal' })
        .in('id', linkIdsToDelete)
      if (error) console.error(error)
    }
  },
}