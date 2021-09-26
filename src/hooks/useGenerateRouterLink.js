import { computed } from 'vue'
import { generalStore } from '@/store'

export default function useGenerateRouterLink() {
	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)

	/**
	 * Generate a router link based on the given to options.
	 * @param {import('vue-router').RouteLocation} to "to" object
	 * @returns {import('vue-router').RouteLocation} "to" object
	 */
	const generateRouterLink = to => computed(() => {
		const params = (isHiddenMode.value) 
			? Object.assign({}, { ...to?.params, isHiddenMode: 'hidden' })
			: Object.assign({}, { ...to?.params })

		return {
			...to,
			params,
		}
	})

	return {
		generateRouterLink
	}
}