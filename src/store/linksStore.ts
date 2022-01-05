import { reactive, computed } from 'vue'
import { definitions } from '@/../types/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import useSupabase, { generateUUID, handleRealtimeEvent } from '@/hooks/useSupabase'

import generalStore from '@/store/generalStore'
import joinNotesLinksStore, { JoinNotesLinksInsertParams, JoinNotesLinksUpdateParams } from '@/store/joinNotesLinksStore'
import isImageValid from '@/utils/isImageValid'
import handleError from '@/utils/handleError'
import arrayUtils from '@/utils/arrayUtils'

type Note = definitions['notes']
type Link = Modify<definitions['links'], { 
  title: string | null, 
  banner_url: string | null 
}>
type LinkGeneratedByFunction = Link
type LinkInsertParams = PartialBy<Link, 'url'>

const supabase = useSupabase()
const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
  state: reactive({
    links: [] as Link[],
  }),

  getLinkDefaultDataObject({ link }: { link: LinkInsertParams }): LinkGeneratedByFunction {
    const data: LinkGeneratedByFunction = {
      id: 				link?.id || generateUUID(),
      url:        link.url,
      title:      link?.title || null,
      banner_url: link?.banner_url || null,
      owner_id:   link?.owner_id || generalStore.getUserId(),
      is_hidden:  link?.is_hidden || isHiddenMode.value
    }
    return data
  },

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

  findLinksByUrls({ urlArray }: { urlArray: string[] }) {
    return this.state.links.filter(link => urlArray.includes(link.url))
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

    // Local state is not updated here, since it will be covered by realtime updates.
  },

  /**
   * This action does two things
   * - it upserts all the links given links that are not already stored in the DB.
   * - it updates/creates all the joinNotesLinks
   * @param linkObjArr Use this only together with `getLinkDefaultDataObject`
   */
  async linksUpsert({ 
    linkObjArr, 
    noteId, 
    joinNotesLinksObj = { annotation: undefined, is_added_from_text: true, is_in_text: false, is_hidden: false } 
  }: {
    linkObjArr: LinkGeneratedByFunction[],
    noteId: Note['id'],
    joinNotesLinksObj?: JoinNotesLinksUpdateParams
  }) {
    try {
      // Filter out duplicates from the linkObjArr
      linkObjArr = linkObjArr.filter(( linkObj, key ) => linkObjArr.findIndex(t => (t.url === linkObj.url)) === key)
      if (!linkObjArr.length)
        return 

      // Prepare the links data
      const preparedData = linkObjArr.map(linkObj => {
        const existingLink = this.state.links.find(link => link.url === linkObj.url)
        return existingLink || linkObj
      })

      // Links: Upsert store
      arrayUtils.upsertValues({ arr: this.state.links, newValArr: preparedData, conflictKey: 'url' })

      // Links: Upsert DB
      const { error } = await supabase
        .from<Link>('links')
        .upsert(preparedData, { onConflict: 'url', returning: 'minimal' })
      if (error) throw error;

      // Start the metadata updates backend in database
      for (const preparedDataItem of preparedData) {
        supabase
          .rpc('fetch_url_metadata', { link_id: preparedDataItem.id, url: preparedDataItem.url })
          .then(metadataRes => { if (metadataRes.error) console.error(metadataRes.error) })
      }

      // JoinNotesLinks: Insert
      joinNotesLinksStore.joinNotesLinksInsert({ newVals: preparedData.map(linkObj => {
        const newLinkId = linkObj?.id || preparedData.find(link => link.url === linkObj.url)?.id
        if (!newLinkId) throw new Error('Error adding links, please try again.')

        return { ...joinNotesLinksObj, note_id: noteId, link_id: newLinkId } as JoinNotesLinksInsertParams
      }) })

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

    // Delete links store
    arrayUtils.deleteByIds({ arr: this.state.links, ids: linkIdsToDelete })

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

  async handleRealtimeEvent(payload: SupabaseRealtimePayload<Link>) {
    handleRealtimeEvent({ payload, stateArr: this.state.links })
  },
}