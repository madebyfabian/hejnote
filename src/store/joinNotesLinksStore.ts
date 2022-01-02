import { reactive, computed } from 'vue'
import { definitions } from '@/../types/supabase'
import useSupabase from '@/hooks/useSupabase'
import useSnackbar from '@/hooks/useSnackbar'
import handleError from '@/utils/handleError'
import generalStore from '@/store/generalStore'
import arrayUtils from '@/utils/arrayUtils'

export type Note = definitions['notes']
export type Link = definitions['links']
export type JoinNotesLinks = definitions['join_notes_links']
export type JoinNotesLinksUpdateParams = Partial<Pick<JoinNotesLinks, 'annotation' | 'is_added_from_text' | 'is_in_text' | 'is_hidden'>>
export type JoinNotesLinksInsertParams = Partial<Omit<JoinNotesLinks, 'id'>>

const supabase = useSupabase()
const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
  state: reactive({
    joinNotesLinks: [] as JoinNotesLinks[],
  }),

  findJoinNotesLinksByNoteIds({ noteIds }: { noteIds: Note['id'][] }) {
    return this.state.joinNotesLinks.filter(join => noteIds.includes(join.note_id))
  },

  async _fetchLinkIdsByUrls({ urlArray }: { urlArray: string[] }) {
    const { data, error } = await supabase
      .from<Link>('links')
      .select()
      .in('url', urlArray)
      .eq('is_hidden', isHiddenMode.value)

    if (error || data === null) throw error

    return data.map(dataItem => dataItem.id)
  },

  async joinNotesLinksFetch({ fetchHidden }: { fetchHidden: boolean }) {
    const { data, error } = await supabase
      .from<JoinNotesLinks>('join_notes_links')
      .select('*')
      .eq('is_hidden', fetchHidden)

    if (error || data === null) return console.error(error)

    this.state.joinNotesLinks = data
  },

  async joinNotesLinksInsert({ newVals }: { newVals: JoinNotesLinksInsertParams[] }) {
    // Filter out duplicates
    newVals = newVals.filter(newVal => !this.state.joinNotesLinks.find(join => 
      join.note_id === newVal.note_id && 
      join.link_id === newVal.link_id))

    if (!newVals.length) {
      return useSnackbar().createSnackbar({ message: 'This link already exists.' })
    }

    // remove when realtime is implemented
    await this.joinNotesLinksFetch({ fetchHidden: isHiddenMode.value })

    const { data, error } = await supabase
      .from<JoinNotesLinks>('join_notes_links')
      .insert(newVals.map(newVal => ({
        ...newVal,
        owner_id: generalStore.getUserId(),
        is_hidden: isHiddenMode.value,
      })))

    if (error || data === null)
      return console.error(error)

    this.state.joinNotesLinks.push(...data)
  },

  async joinNotesLinksUpdate({ joinIds, urlArray = [], noteId, newVal }: { joinIds: JoinNotesLinks['id'][], urlArray?: string[], noteId: Note['id'], newVal: JoinNotesLinksUpdateParams }) {
    if (!newVal)
      return console.error('joinNotesLinksUpdate: Missing required parameter "newVal"')

    try {
      let newData: JoinNotesLinks[]
      
      // When no join ids are defined, we have to fetch the link ids
      if (!joinIds?.length) {
        if (!noteId)
          throw new Error('joinNotesLinksUpdate: Missing parameter "noteId"')

        const linkIds = await this._fetchLinkIdsByUrls({ urlArray })

        // Update DB.
        const { data, error } = await supabase
          .from<JoinNotesLinks>('join_notes_links')
          .update(newVal)
          .eq('note_id', noteId)
          .in('link_id', linkIds)
        if (error || !data) throw error

        newData = data

      } else {
        // Update DB.
        const { data, error } = await supabase
          .from<JoinNotesLinks>('join_notes_links')
          .update(newVal)
          .in('id', joinIds)
        if (error || !data) throw error

        newData = data
      }

      // Update state
      newData.forEach(newDataItem => {
        const index = arrayUtils.findIndexById({ id: newDataItem.id, arr: this.state.joinNotesLinks })
        this.state.joinNotesLinks[index] = newDataItem
      })

    } catch (error) {
      handleError(error)
    }
  },

  async joinNotesLinksDelete({ joinIds = [] } = {} as { joinIds: JoinNotesLinks['id'][] }) {
    // Delete all defined joins.
    const { error } = await supabase
      .from<JoinNotesLinks>('join_notes_links')
      .delete({ returning: 'minimal' })
      .in('id', joinIds)
    if (error) return console.error(error)

    this.state.joinNotesLinks = this.state.joinNotesLinks.filter(join => !joinIds.includes(join.id))
  }
}