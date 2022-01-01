import { reactive, computed } from 'vue'
import generalStore from '@/store/generalStore'
import notesStore from '@/store/notesStore'
import useSnackbar from '@/hooks/useSnackbar'
import useSupabase, { formatTimeToSupabaseFormat, generateUUID } from '@/hooks/useSupabase'
import useConfirm from '@/hooks/useConfirm'
import arrayUtils from '@/utils/arrayUtils'
import handleError from '@/utils/handleError'

const supabase = useSupabase()
const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
	state: reactive({
		collections: [],
	}),


  // Helpers
  collectionFindById({ collectionId }) {
    return arrayUtils.findValueById({ id: collectionId, arr: this.state.collections })
  },


  // Network
	async collectionsFetch({ fetchHidden = false } = {}) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_hidden', fetchHidden)
    
    if (error) console.error(error)

    this.state.collections = data
  },

  async collectionsInsertSingle({ newVal }) {
    let snackbar
    try {
      newVal = {
        ...newVal,
        created_at: formatTimeToSupabaseFormat({ date: new Date() }),
        updated_at: formatTimeToSupabaseFormat({ date: new Date() }),
        id: generateUUID(),
        owner_id: generalStore.state.user.id,
        is_hidden: isHiddenMode.value,
      }

      arrayUtils.insertValue({ arr: this.state.collections, newVal })
      snackbar = useSnackbar().createSnackbar({ 
        message: 'Successfully added a new collection'
      })

      const { error } = await supabase
        .from('collections')
        .insert([ newVal ])
        
      if (error) throw error

    } catch (error) {
      snackbar.remove()
      handleError(error, { userMessage: 'There was an error while trying to add a new collection' })
    }
  },

  async collectionsUpdateSingle({ collectionId, newVal }) {
    try {
      newVal = { 
        ...newVal,
        updated_at: formatTimeToSupabaseFormat({ date: new Date() }),
      }

      // Delete id column because it's not needed and supabase throws an error.
      delete newVal?.id

      arrayUtils.updateById({ id: collectionId, arr: this.state.collections, newVal })

      const { error } = await supabase
        .from('collections')
        .update(newVal)
        .eq('id', collectionId)
        
      if (error) throw error
    
    } catch (error) {
      handleError(error, { userMessage: 'There was an error while trying to update the collection' })
    }
  },

  async collectionsDelete({ collectionIds }) {
    let snackbar
    try {
      arrayUtils.deleteByIds({ arr: this.state.collections, ids: collectionIds })
      snackbar = useSnackbar().createSnackbar({ 
        message: `Successfully deleted collection`
      })

      // Unlink all collection_id from all notes
      try {
        await notesStore.notesUpdateUnlinkCollections({ collectionIds })
      } catch (_) {}

      const { error } = await supabase
        .from('collections')
        .delete()
        .in('id', collectionIds)
      
      if (error) throw error
    
    } catch (error) {
      snackbar.remove()
      handleError(error, { userMessage: 'There was an error while trying to delete the collection' })
    }
  },

  async handleRealtimeEvent( payload ) {
    try {
      if (payload.errors)
        throw new Error(JSON.stringify(payload.errors))

      switch (payload.eventType) {
        case 'INSERT': return arrayUtils.insertValue({ arr: this.state.collections, newVal: payload.new })
        case 'UPDATE': return arrayUtils.updateById({ arr: this.state.collections, id: payload.new.id, newVal: payload.new })
        case 'DELETE': return arrayUtils.deleteByIds({ arr: this.state.collections, ids: [ payload.old.id ] })
      }

    } catch (error) {
      handleError(error)
    }
  },


  // UI Actions
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