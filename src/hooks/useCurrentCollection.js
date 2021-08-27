import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'

export default function useCurrentCollection() {
	return computed(() => {
		const collectionId = useRoute().params.collectionId
		return store.collectionFindById({ collectionId })
	})
}