import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default function useIsHiddenMode() {
	return computed(() => !!useRoute().params.isHiddenMode)
}