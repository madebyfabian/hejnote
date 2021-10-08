import { computed } from 'vue'
import { useWindowSize } from 'vue-window-size'

export default function useIsMobileDevice() {
	const { width: windowWidth } = useWindowSize()

	return computed(() => windowWidth.value <= 1064)
}