import { reactive, computed } from 'vue'
import useSnackbar from '@/hooks/useSnackbar'
import handleError from '@/utils/handleError'
import useSupabase from '@/hooks/useSupabase'
import generalStore from '@/store/generalStore'
import notesStore from '@/store/notesStore'
import findIndexById from '@/utils/findIndexById'

const supabase = useSupabase()

const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


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

  async collectionsInsertSingle({ newVal }) {
    try {
      let res
   
      res = await supabase.from('collections').insert([{ 
        ...newVal, 
        owner_id: generalStore.state.user.id,
        is_hidden: isHiddenMode.value,
      }])
      if (res.error) throw res.error

      const newData = res?.data?.[0]
      const isEmpty = !newData?.id
      if (isEmpty) throw new Error('No data returned')

      this.state.collections.push(newData)

      useSnackbar().createSnackbar({ 
        message: 'Successfully added new collection'
      })

      return newData
    } catch (error) {
      handleError(error)
    }
  },

  async collectionsUpdateSingle({ collectionId, newVal }) {
    try {
      // Delete id column because it's not needed and supabase throws an error.
      newVal = { ...newVal }
      delete newVal?.id

      // Update database
      const { data, error } = await supabase.from('collections').update(newVal).eq('id', collectionId)
      if (error) throw error
      newVal = data[0]
    
      // Update local state
      const index = findIndexById({ id: collectionId, data: this.state.collections })
      const newData = { ...this.state.collections[index], ...newVal }
      this.state.collections[index] = newData
    
    } catch (error) {
      handleError(error)
    }
  },

  async collectionsDelete({ collectionIds }) {
    try {
      // First unlink all collection_id from all notes
      try {
        await notesStore.notesUpdateUnlinkCollections({ collectionIds })
      } catch (_) {}

      // Delete from database
      const { error } = await supabase.from('collections').delete().in('id', collectionIds)
      if (error) throw error

      // Delete from state
      this.state.collections = this.state.collections.filter(note => !collectionIds.includes(note.id))

      useSnackbar().createSnackbar({ 
        message: `Deleted ${ collectionIds.length } collection${ collectionIds.length === 1 ? '' : 's' }`
      })
    
    } catch (error) {
      handleError(error)
    }
  },
}