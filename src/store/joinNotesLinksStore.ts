import { reactive, computed } from 'vue'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import useSupabase, { 
  generateUUID, handleRealtimeEvent, 
  JoinNotesLinks, Note, Link, JoinNotesLinksInsertParams, JoinNotesLinksUpdateParams 
} from '@/hooks/useSupabase'

import useSnackbar from '@/hooks/useSnackbar'
import handleError from '@/utils/handleError'
import generalStore from '@/store/generalStore'
import arrayUtils from '@/utils/arrayUtils'

const supabase = useSupabase()
const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
  state: reactive({
    joinNotesLinks: [] as JoinNotesLinks[],
  }),

  findJoinNotesLinksInNoteByLinkIds({ linkIds, noteId }: { linkIds: Link['id'][], noteId: Note['id'] }) {
    return this.state.joinNotesLinks.filter(join => linkIds.includes(join.link_id) && noteId === join.note_id)
  },

  // ???
  findJoinNotesLinksByNoteIds({ noteIds }: { noteIds: Note['id'][] }) {
    return this.state.joinNotesLinks.filter(join => noteIds.includes(join.note_id))
  },

  // replace this as soon as linksStore and joinNotesLinksStore are merged
  async _fetchLinkIdsByUrls({ urlArray }: { urlArray: string[] }) {
    const { data, error } = await supabase
      .from<Link>('links')
      .select()
      .in('url', urlArray)
      .eq('is_hidden', isHiddenMode.value)

    if (error || data === null) throw error

    return data.map(dataItem => dataItem.id)
  },

  // 💚
  async joinNotesLinksFetch({ fetchHidden }: { fetchHidden: boolean }) {
    const { data, error } = await supabase
      .from<JoinNotesLinks>('join_notes_links')
      .select('*')
      .eq('is_hidden', fetchHidden)

    if (error || data === null) return console.error(error)

    this.state.joinNotesLinks = data
  },

  // 💚
  async joinNotesLinksInsert({ newVals }: { newVals: JoinNotesLinksInsertParams[] }) {
    try {
      // Filter out duplicates
      newVals = newVals.filter(newVal => !this.state.joinNotesLinks.find(join => 
        join.note_id === newVal.note_id && 
        join.link_id === newVal.link_id))

      if (!newVals.length)
        return useSnackbar().createSnackbar({ message: 'This link already exists.' })

      const preparedData = newVals.map(( newVal ): JoinNotesLinks => { return {
        id: generateUUID(),
        note_id: newVal.note_id,
        link_id: newVal.link_id,
        owner_id: generalStore.getUserId(),
        is_added_from_text: newVal.is_added_from_text ?? true,
        annotation: newVal.annotation || null,
        is_in_text: newVal.is_in_text ?? true,
        is_hidden: isHiddenMode.value,
      }})

      for (const preparedDataItem of preparedData) {
        arrayUtils.insertValue({ arr: this.state.joinNotesLinks, newVal: preparedDataItem })
      }

      const { error } = await supabase
        .from<JoinNotesLinks>('join_notes_links')
        .insert(preparedData, { returning: 'minimal' })

      if (error) throw error

    } catch (error) {
      handleError(error)
    }
  },

  // 💚
  async joinNotesLinksUpdate({ 
    joinIds, 
    noteId, 
    newVal 
  }: { 
    joinIds: JoinNotesLinks['id'][], 
    noteId: Note['id'], 
    newVal: JoinNotesLinksUpdateParams 
  }) {
    try {
      for (const joinId of joinIds) {
        arrayUtils.updateById({ arr: this.state.joinNotesLinks, id: joinId, newVal })
      }

      const { error } = await supabase
        .from<JoinNotesLinks>('join_notes_links')
        .update(newVal, { returning: 'minimal' })
        .eq('note_id', noteId)
        .in('id', joinIds)

      if (error) throw error

    } catch (error) {
      handleError(error)
    }
  },

  // 💚
  async joinNotesLinksDelete({ joinIds = [] } = {} as { joinIds: JoinNotesLinks['id'][] }) {
    try {
      arrayUtils.deleteByIds({ arr: this.state.joinNotesLinks, ids: joinIds })

      const { error } = await supabase
        .from<JoinNotesLinks>('join_notes_links')
        .delete({ returning: 'minimal' })
        .in('id', joinIds)

      if (error) throw error

    } catch (error) {
      handleError(error)
    }
  },

  async handleRealtimeEvent(payload: SupabaseRealtimePayload<JoinNotesLinks>) {
    handleRealtimeEvent({ payload, stateArr: this.state.joinNotesLinks })
  },
}