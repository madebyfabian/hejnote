import { reactive } from 'vue'
import { generalStore } from '@/store/generalStore'
import useSupabase from '@/hooks/useSupabase'

const supabase = useSupabase()

export const joinNotesLinksStore = {
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
    // Get all link.id's for this note
    const linksRes = await supabase
      .from('links')
      .select()
      .in('url', urlArray)
    if (linksRes.error) return console.error(linksRes.error)
    const linkIds = linksRes.data.map(dataItem => dataItem.id)

    // Delete all joins for this note
    const { error } = await supabase
      .from('join_notes_links')
      .delete()
      .eq('note_id', noteId)
      .in('link_id', linkIds)
    if (error) console.error(error)

    // Remove deleted joins from state
    this.state.joinNotesLinks = this.state.joinNotesLinks.filter(join => !linkIds.includes(join.link_id))
  },
}