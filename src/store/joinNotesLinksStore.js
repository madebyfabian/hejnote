import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

import generalStore from '@/store/generalStore'

const supabase = useSupabase()

export default {
  state: reactive({
    joinNotesLinks: [],
  }),

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

  async joinNotesLinksDelete({ urlArray, noteId }) {
    let linkIdsToDelete = []

    // If urlArray is defined, only delete those for noteId. If not, delete all.
    if (urlArray) {
      // Get all link.id's for this note
      const linksRes = await supabase
        .from('links')
        .select()
        .in('url', urlArray)

      if (linksRes.error) 
        return console.error(linksRes.error)

      linkIdsToDelete = linksRes.data.map(dataItem => dataItem.id)

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