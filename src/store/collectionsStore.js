import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

const supabase = useSupabase()

export default {
	state: reactive({
		collections: [],
	}),

	async collectionsFetch({ fetchHidden = false } = {}) {
    const { data, error } = await supabase.from('collections').select('*').eq('is_hidden', fetchHidden)
    if (error) 
      console.error(error)

    this.state.collections = data
  },

  collectionFindById({ collectionId }) {
    return this.state.collections.find(collection => collection.id === collectionId)
  },
}