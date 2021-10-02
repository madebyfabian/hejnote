<template>
	<Menu>
    <MenuButton ref="menuButtonEl">
			<slot name="button" />
		</MenuButton>

    <teleport to="body">
			<transition name="transition-menu">
				<MenuItems 
					class="absolute z-40 py-2 rounded-xl bg-gray-800 border border-gray-700 min-w-[200px]"
					:class="propAlignRight ? 'origin-top-right' : 'origin-top-left'"
					:style="menuOffsetStyles">

					<slot />
				</MenuItems>
			</transition>
		</teleport>
  </Menu>
</template>

<script setup>
	import { ref, computed, watch } from 'vue'
	import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
	import { useWindowSize } from 'vue-window-size'

	const props = defineProps({
		align: { type: String, default: 'left', validator: v => [ 'left', 'right' ].includes(v) },
	})
	const propAlignRight = computed(() => props.align === 'right')

	const { width: windowWidth } = useWindowSize()
	const menuButtonEl = ref(null)

	// Computeds
	const menuOffsetStyles = computed(() => {
		const rect = menuButtonEl.value?.el?.getBoundingClientRect()

		// Define variable to trigger computed rerender on window width change
		const windowWidthVal = windowWidth.value,
					scrollBarWidth = windowWidthVal - document.documentElement.clientWidth

		const top = Math.round(rect?.top + rect?.height) + 'px'
		const left = propAlignRight.value
			? 'initial' 
			: Math.round(rect?.left) + 'px'
		const right = propAlignRight.value
			? Math.round(windowWidthVal - scrollBarWidth - (rect?.left + rect?.width)) + 'px' 
			: 'initial'

		return { top, left, right }
	})
</script>

<style lang="postcss" scoped>
	.transition-menu {
		&-enter-active						{ @apply transition duration-100 ease-out }	
		&-enter-from, &-leave-to 	{ @apply transform-gpu scale-95 opacity-0 }
		&-enter-to, &-leave-from 	{ @apply transform-gpu scale-100 opacity-100 }
		&-leave-active 						{ @apply transition duration-75 ease-out }
	}
</style>