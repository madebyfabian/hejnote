import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { collectionsStore } from '@/store' 

export default function useCurrentCollection() {
	return computed(() => {
		const collectionId = useRoute()?.params?.collectionId
		if (typeof collectionId !== 'string')
			return undefined
			
		return collectionsStore.collectionFindById({ collectionId })
	})
}