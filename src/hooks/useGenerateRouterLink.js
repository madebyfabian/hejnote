import { computed } from 'vue'
import useIsHiddenMode from '@/hooks/useIsHiddenMode'

export default function useGenerateRouterLink() {
	/**
	 * Generate a router link based on the given options.
	 * @param {import('vue-router').RouteLocation} options "to" object
	 * @returns {import('vue-router').RouteLocation} "to" object
	 */
	const generateRouterLink = options => computed(() => {
		const isHiddenMode = useIsHiddenMode()

		const params = (isHiddenMode.value) 
			? Object.assign({}, { ...options?.params, isHiddenMode: 'hidden' })
			: Object.assign({}, { ...options?.params })

		return {
			...options.to,
			params,
		}
	})

	return {
		generateRouterLink
	}
}