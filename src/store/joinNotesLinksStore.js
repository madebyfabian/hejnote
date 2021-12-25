import { reactive, computed } from 'vue'
import useSupabase from '@/hooks/useSupabase'
import useSnackbar from '@/hooks/useSnackbar'
import handleError from '@/utils/handleError'
import findIndexById from '@/utils/findIndexById'
import generalStore from '@/store/generalStore'

const supabase = useSupabase()

const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
  state: reactive({
    joinNotesLinks: [],
  }),

  findJoinNotesLinksByNoteIds({ noteIds }) {
    return this.state.joinNotesLinks.filter(join => noteIds.includes(join.note_id))
  },

  async _fetchLinkIdsByUrls({ urlArray }) {
    const { data, error } = await supabase
      .from('links')
      .select()
      .in('url', urlArray)
      .eq('is_hidden', isHiddenMode.value)

    if (error) throw error

    return data.map(dataItem => dataItem.id)
  },

  async joinNotesLinksFetch({ fetchHidden } = {}) {
    const { data, error } = await supabase
      .from('join_notes_links')
      .select('*')
      .eq('is_hidden', fetchHidden)

    if (error) return console.error(error)

    this.state.joinNotesLinks = data
  },

  async joinNotesLinksInsert({ newVals }) {
    // Filter out duplicates
    newVals = newVals.filter(newVal => !this.state.joinNotesLinks.find(join => 
      join.note_id === newVal.note_id && 
      join.link_id === newVal.link_id))

    if (!newVals.length) {
      return useSnackbar().createSnackbar({ message: 'This link already exists.' })
    }

    await this.joinNotesLinksFetch({ fetchHidden: isHiddenMode.value })

    const { data, error } = await supabase
      .from('join_notes_links')
      .insert(newVals.map(newVal => ({
        ...newVal,
        owner_id: generalStore.state.user.id,
        is_hidden: isHiddenMode.value,
      })))

    if (error)
      console.error(error)

    this.state.joinNotesLinks.push(...data)
  },

  async joinNotesLinksUpdate({ joinIds, urlArray = [], noteId, newVal }) {
    if (!newVal)
      return console.error('joinNotesLinksUpdate: Missing required parameter "newVal"')

    // Delete id column because it's not needed and supabase throws an error.
    newVal = { ...newVal }
    delete newVal?.id

    try {
      let newData
      
      // When no join ids are defined, we have to fetch the link ids
      if (!joinIds?.length) {
        if (!noteId)
          throw new Error('joinNotesLinksUpdate: Missing parameter "noteId"')

        const linkIds = await this._fetchLinkIdsByUrls({ urlArray })

        // Update DB.
        const { data, error } = await supabase
          .from('join_notes_links')
          .update(newVal)
          .eq('note_id', noteId)
          .in('link_id', linkIds)
        if (error) throw error

        newData = data

      } else {
        // Update DB.
        const { data, error } = await supabase
          .from('join_notes_links')
          .update(newVal)
          .in('id', joinIds)
        if (error) throw error

        newData = data
      }

      // Update state
      newData.forEach(newDataItem => {
        const index = findIndexById({ id: newDataItem.id, data: this.state.joinNotesLinks })
        this.state.joinNotesLinks[index] = newDataItem
      })

    } catch (error) {
      handleError(error)
    }
  },

  async joinNotesLinksDelete({ joinIds = [] } = {}) {
    // Delete all defined joins.
    const { error } = await supabase
      .from('join_notes_links')
      .delete()
      .in('id', joinIds)
    if (error) return console.error(error)

    this.state.joinNotesLinks = this.state.joinNotesLinks.filter(join => !joinIds.includes(join.id))
  }
}