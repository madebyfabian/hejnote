import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

const supabase = useSupabase()

export default {
  state: reactive({
    joinNotesCollections: [],
  }),

  async joinNotesCollectionsFetch() {
    const { data, error } = await supabase.from('join_notes_collections').select('*')
    if (error) 
      return console.error(error)

    this.state.joinNotesCollections = data
  }
}