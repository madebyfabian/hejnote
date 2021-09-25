<template>
	<span 
		class="TabNav-ActiveIndicator pointer-events-none h-full block w-20 absolute left-0 top-0 rounded-xl bg-gray-800 opacity-0"
		aria-hidden="true" 
		:class="{ 'opacity-100': isMounted, 'transition duration-225': isMountedAfterDelay }"
		:style="{ 'transform': `translateX(${ activeTabIndicatorPos }px)` }"
	/>
</template>

<script setup>
	import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'

	const props = defineProps({
		tabNavWrapperId: 				{ required: true },
		activeTabItemRouteName: { required: true }
	})

	const activeTabIndicatorPos = ref(0),
				isMounted = ref(false),
				isMountedAfterDelay = ref(false)

	const handleNavIndicatorUpdate = () => {
		// First, get new active tab item el.
		const wrapperEl = document.getElementById(props.tabNavWrapperId)
		const el = wrapperEl?.querySelector(`[data-route-name="${ props.activeTabItemRouteName }"]`)

		// Then, get the left position of the el.
		const offsetLeft = el?.offsetLeft || 0

		activeTabIndicatorPos.value = offsetLeft
	}

	// When component mounted the first time
	onMounted(async () => {
		isMounted.value = true
		setTimeout(() => { isMountedAfterDelay.value = true }, 10) // 1ms delay, nextTick didnt work.

		handleNavIndicatorUpdate()
	})

	// When current route changes
	watch(() => props.activeTabItemRouteName, handleNavIndicatorUpdate)

	// When window resizes
	window.addEventListener('resize', handleNavIndicatorUpdate)
	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleNavIndicatorUpdate)
	})
</script>