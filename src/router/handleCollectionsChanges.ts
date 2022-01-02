import { watch } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import { collectionsStore } from '@/store'

/**
 * This will watch the collections store and if there are any changes,
 * and we are inside a collection, it will check if the collection we are in
 * also still exists in the list. If not, redirect.
 */
export default ({ doRedirect = () => {}, route }: { doRedirect: () => void, route: RouteLocationNormalized }) => {
	return watch(() => collectionsStore.state.collections, () => {
		// If no id is set, we are not inside a collection
		const currentCollectionId = route?.params?.collectionId
		if (!currentCollectionId || typeof currentCollectionId !== 'string')
			return 

		// If no collections are set, we can't check.
		if (!collectionsStore.state.collections.length)
			return 

		// If the collection is not in the list, redirect.
		const foundCollection = collectionsStore.collectionFindById({ collectionId: currentCollectionId })
		if (!foundCollection)
			return doRedirect()
	}, { immediate: true })
}