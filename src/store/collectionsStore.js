import { reactive, computed } from 'vue'
import useSnackbar from '@/hooks/useSnackbar'
import handleError from '@/utils/handleError'
import useSupabase from '@/hooks/useSupabase'
import generalStore from '@/store/generalStore'
import notesStore from '@/store/notesStore'
import findIndexById from '@/utils/findIndexById'
import useConfirm from '@/hooks/useConfirm'

const supabase = useSupabase()

const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
	state: reactive({
		collections: [],
	}),

	async collectionsFetch({ fetchHidden = false } = {}) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_hidden', fetchHidden)
    
    if (error) console.error(error)

    this.state.collections = data
  },

  collectionFindById({ collectionId }) {
    return this.state.collections.find(collection => collection.id === collectionId)
  },

  async collectionsInsertSingle({ newVal }) {
    try {
      const { error } = await supabase
        .from('collections')
        .insert([{ 
          ...newVal, 
          owner_id: generalStore.state.user.id,
          is_hidden: isHiddenMode.value,
        }])

      if (error) throw error

      useSnackbar().createSnackbar({ 
        message: 'Successfully added new collection'
      })

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
      const { error } = await supabase
        .from('collections')
        .update(newVal)
        .eq('id', collectionId)
        
      if (error) throw error
    
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
      const { error } = await supabase
        .from('collections')
        .delete()
        .in('id', collectionIds)
      
      if (error) throw error

      useSnackbar().createSnackbar({ 
        message: `Successfully deleted collection`
      })
    
    } catch (error) {
      handleError(error)
    }
  },

  async handleRealtimeEvent( payload ) {
    try {
      if (payload.errors)
        throw new Error(JSON.stringify(payload.errors))

      switch (payload.eventType) {
        case 'INSERT': {
          this.state.collections.push(payload.new)
          break
        }

        case 'UPDATE': {
          const index = findIndexById({ id: payload.new.id, data: this.state.collections })
          const newData = { ...this.state.collections[index], ...payload.new }
          this.state.collections[index] = newData
          break
        }

        case 'DELETE': {
          this.state.collections = this.state.collections.filter(collection => collection.id !== payload.old.id)
          break
        }
      }

    } catch (error) {
      handleError(error)
    }
  },


  /**
   * UI Actions
   */
  async handleAddNewCollection() {
    const answer = await useConfirm().doConfirm({ 
			title: 'Add new collection',
			inputProps: {
				placeholder: 'Name'
			}
		})
		if (!answer) 
      return

		this.collectionsInsertSingle({ newVal: { title: answer } })

    return answer
  },
}