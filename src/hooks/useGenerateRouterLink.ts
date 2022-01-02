import { computed } from 'vue'
import { LocationAsRelativeRaw } from 'vue-router'
import { generalStore } from '@/store'

export default function useGenerateRouterLink() {
	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)

	/**
	 * Generate a router link based on the given to options.
	 * @param to "to" object
	 * @returns "to" object
	 */
	const generateRouterLink = ( to: LocationAsRelativeRaw ) => computed(() => {
		let params
		if (typeof to === 'object' && to.hasOwnProperty('params'))
			params = (isHiddenMode.value) 
				? Object.assign({}, { ...to?.params, isHiddenMode: 'hidden' })
				: Object.assign({}, { ...to?.params })

		return {
			...to,
			params,
		} as LocationAsRelativeRaw
	})

	return {
		generateRouterLink
	}
}