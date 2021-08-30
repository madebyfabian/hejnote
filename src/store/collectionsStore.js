import { reactive } from 'vue'
import useSupabase from '@/hooks/useSupabase'

const supabase = useSupabase()

export default {
	state: reactive({
		collections: [],
	}),

	async collectionsFetch() {
    const { data, error } = await supabase
      .from('collections')
      .select('*')

    if (error) 
      console.error(error)

    this.state.collections = data
  },

  collectionFindById({ collectionId }) {
    return this.state.collections.find(collection => collection.id === collectionId)
  },
}