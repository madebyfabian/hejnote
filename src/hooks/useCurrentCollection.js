import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { collectionsStore } from '@/store' 

export default function useCurrentCollection() {
	return computed(() => {
		const collectionId = useRoute()?.params?.collectionId
		return collectionsStore.collectionFindById({ collectionId })
	})
}