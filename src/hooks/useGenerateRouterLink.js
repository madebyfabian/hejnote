import { computed } from 'vue'
import useIsHiddenMode from '@/hooks/useIsHiddenMode'

export default function useGenerateRouterLink() {
	/**
	 * Generate a router link based on the given to options.
	 * @param {import('vue-router').RouteLocation} to "to" object
	 * @returns {import('vue-router').RouteLocation} "to" object
	 */
	const generateRouterLink = to => computed(() => {
		const isHiddenMode = useIsHiddenMode()

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