import { reactive, computed } from 'vue'
import { definitions } from '@/../types/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import generalStore from '@/store/generalStore'
// @ts-ignore
import notesStore from '@/store/notesStore'
import useSnackbar from '@/hooks/useSnackbar'
import useSupabase, { formatTimeToSupabaseFormat, generateUUID } from '@/hooks/useSupabase'
// @ts-ignore
import useConfirm from '@/hooks/useConfirm'
import arrayUtils from '@/utils/arrayUtils'
// @ts-ignore
import handleError from '@/utils/handleError'

type Collection = definitions['collections']
type CollectionUpdate = Pick<Collection, 'title' | 'updated_at'>
type CollectionUpdateParams = Pick<Collection, 'title'>
type CollectionInsertParams = Partial<Pick<Collection, 'title'>>

const supabase = useSupabase()
const isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
	state: reactive({
		collections: [] as Collection[],
	}),


  // Helpers
  collectionFindById({ collectionId }: { collectionId: Collection['id'] }) {
    return arrayUtils.findValueById({ id: collectionId, arr: this.state.collections })
  },


  // Network
	async collectionsFetch({ fetchHidden = false } = {}) {
    const { data, error } = await supabase
      .from<Collection>('collections')
      .select('*')
      .eq('is_hidden', fetchHidden)
    
    if (error || data === null)
      throw error

    this.state.collections = data
  },

  async collectionsInsertSingle({ newVal }: { newVal: CollectionInsertParams }) {
    let snackbar
    try {
      if (!generalStore.state.user?.id)
        throw new Error('User is not logged in')

      const finalVal: Collection = {
        title: newVal.title || 'New Collection',
        created_at: formatTimeToSupabaseFormat({ date: new Date() }),
        updated_at: formatTimeToSupabaseFormat({ date: new Date() }),
        id: generateUUID(),
        owner_id: generalStore.state.user.id,
        is_hidden: isHiddenMode.value,
      }

      arrayUtils.insertValue({ arr: this.state.collections, newVal: finalVal })

      snackbar = useSnackbar().createSnackbar({
        message: 'Successfully added a new collection'
      })

      const { error } = await supabase
        .from<Collection>('collections')
        .insert([ finalVal ], { returning: 'minimal' })

      if (error) throw error

    } catch (error) {
      snackbar?.remove()
      handleError(error, { userMessage: 'There was an error while trying to add a new collection' })
    }
  },

  async collectionsUpdateSingle({ collectionId, newVal }: { collectionId: Collection['id'], newVal: CollectionUpdateParams }) {
    try {
      const finalVal: CollectionUpdate = {
        title: newVal.title,
        updated_at: formatTimeToSupabaseFormat({ date: new Date() }),
      }

      arrayUtils.updateById({ id: collectionId, arr: this.state.collections, newVal: finalVal })

      const { error } = await supabase
        .from<Collection>('collections')
        .update(finalVal)
        .eq('id', collectionId)

      if (error) throw error 
    
    } catch (error) {
      handleError(error, { userMessage: 'There was an error while trying to update the collection' })
    }
  },

  async collectionsDelete({ collectionIds }: { collectionIds: Collection['id'][] }) {
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
      snackbar?.remove()
      handleError(error, { userMessage: 'There was an error while trying to delete the collection' })
    }
  },

  async handleRealtimeEvent( payload: SupabaseRealtimePayload<Collection> ) {
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
		if (!answer || typeof answer !== 'string')
      return

		this.collectionsInsertSingle({ newVal: { title: answer } })

    return answer
  },
}