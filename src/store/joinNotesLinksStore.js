import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'
import handleError from '@/utils/handleError'

import generalStore from '@/store/generalStore'

const supabase = useSupabase()

// Helper
const findIndexById = ({ data, id }) => {
  return data.findIndex(obj => obj !== undefined && obj.id === id)
}


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

    if (error) 
      throw error

    return data.map(dataItem => dataItem.id)
  },

  async joinNotesLinksFetch() {
    const { data, error } = await supabase.from('join_notes_links').select('*')
    if (error) 
      return console.error(error)

    this.state.joinNotesLinks = data
  },

  async joinNotesLinksInsert({ newVals }) {
    await this.joinNotesLinksFetch()

    // Filter out duplicates
    newVals = newVals.filter(newVal => !this.state.joinNotesLinks.find(join => 
      join.note_id === newVal.note_id && 
      join.link_id === newVal.link_id))

    const { data, error } = await supabase
      .from('join_notes_links')
      .insert(newVals.map(newVal => ({
        ...newVal,
        owner_id: generalStore.state.user.id
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

  async joinNotesLinksDelete({ urlArray, noteId }) {
    let linkIdsToDelete = []

    // If urlArray is defined, only delete those for noteId. If not, delete all.
    if (urlArray) {
      // Get all link.id's for this note
      linkIdsToDelete = await this._fetchLinkIdsByUrls({ urlArray })

      // Delete all joins for this note that contain these link.id's
      const { error } = await supabase
        .from('join_notes_links')
        .delete()
        .eq('note_id', noteId)
        .in('link_id', linkIdsToDelete)

      if (error) 
        return console.error(error)

    } else {
      // Delete all joins for this note.
      const { data, error } = await supabase
        .from('join_notes_links')
        .delete()
        .eq('note_id', noteId)

      if (error) 
        return console.error(error)

      linkIdsToDelete = data.map(dataItem => dataItem.link_id)
    }

    // Remove deleted joins from state
    this.state.joinNotesLinks.forEach(( join, index ) => {
      if (join.note_id === noteId && linkIdsToDelete.includes(join.link_id))
        this.state.joinNotesLinks.splice(index, 1)
    })

    return linkIdsToDelete
  },

  async joinNotesLinksDeleteV2({ joinsToDelete }) {
    const joinIdsToDelete = joinsToDelete.map(join => join.id)

    // Delete all defined joins.
    const { error } = await supabase
      .from('join_notes_links')
      .delete()
      .in('id', joinIdsToDelete)
    if (error) return console.error(error)

    this.state.joinNotesLinks = this.state.joinNotesLinks.filter(join => !joinIdsToDelete.includes(join.id))
  }
}