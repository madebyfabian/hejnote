<template>
	<Menu v-slot="{ open }">
		<VSlotEmitter :open="open" @changedOpenState="$emit('changedOpenState', open)" />

    <MenuButton ref="menuButtonEl" v-bind="{ class: cssClass }">
			<slot name="button" />
		</MenuButton>

    <teleport to="body">
			<transition name="transition-menu">
				<MenuItems 
					v-if="open"
					static
					class="z-50 py-2 rounded-xl bg-gray-800 border border-gray-700"
					:class="[
						isFixed ? 'fixed' : 'absolute'
					]"
					:style="{
						...menuOffsetStyles,
						transformOrigin: transformOriginStyle,
						width: isFullWidth && 'calc(100% - 2rem)',
						minWidth: !isFullWidth && '200px',
					}"
					>

					<slot />
				</MenuItems>
			</transition>
		</teleport>
  </Menu>
</template>

<script setup>
	import { ref, computed, watch, useSlots, onMounted, createCommentVNode } from 'vue'
	import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
	import { useWindowSize } from 'vue-window-size'

	defineEmits([
		'changedOpenState',
	])

	const props = defineProps({
		cssClass: 				{ default: undefined },
		verticalAlign:		{ type: String, default: 'bottom', validator: v => ['top', 'bottom'].includes(v) },
		align: 						{ type: String, default: 'left', validator: v => [ 'left', 'right' ].includes(v) },
		isFullWidth:			{ type: Boolean, default: false },
		isFixed: 					{ type: Boolean, default: false },
		transformOrigin: 	{ type: String, default: undefined },
	})
	const propAlignRight = computed(() => props.align === 'right'),
				propVerticalAlignTop = computed(() => props.verticalAlign === 'top')

	const { width: windowWidth, height: windowHeight } = useWindowSize()
	const menuButtonEl = ref(null)

	const isMounted = ref(false)
	onMounted(() => isMounted.value = true)

	// Helpers
	const _menuOffsetStyles_top = ({ rect, verticalAlignTop }) => {
		if (!verticalAlignTop)
			return Math.round(rect?.top + rect?.height + 4) + 'px' // 4px spacing
	}

	const _menuOffsetStyles_bottom = ({ rect, verticalAlignTop, windowHeightVal }) => {
		if (verticalAlignTop)
			return Math.round(Math.abs(rect?.top - windowHeightVal)) + 'px'
	}

	const _menuOffsetStyles_left = ({ rect, alignRight, isFullWidth }) => {
		if (isFullWidth)
			return '16px'

		if (!alignRight)
			return Math.round(rect?.left) + 'px'
	}

	const _menuOffsetStyles_right = ({ rect, alignRight, windowWidthVal }) => {
		const scrollBarWidth = windowWidthVal - document.documentElement.clientWidth

		if (alignRight)
			return Math.round(windowWidthVal - scrollBarWidth - (rect?.left + rect?.width)) + 'px'
	}

	// Computeds
	const menuOffsetStyles = computed(() => {
		const rect = menuButtonEl.value?.el?.getBoundingClientRect()
		if (!rect || !isMounted.value)
			return {}

		// Define variables to trigger computed rerender
		const alignRight = propAlignRight.value
		const verticalAlignTop = propVerticalAlignTop.value
		const windowWidthVal = windowWidth.value,
					windowHeightVal = windowHeight.value

		const top = _menuOffsetStyles_top({ rect, verticalAlignTop })
		const bottom = _menuOffsetStyles_bottom({ rect, verticalAlignTop, windowHeightVal })
		const left = _menuOffsetStyles_left({ rect, alignRight, isFullWidth: props.isFullWidth })
		const right = _menuOffsetStyles_right({ rect, alignRight, windowWidthVal })

		return { top, bottom, left, right }
	})

	const transformOriginStyle = computed(() => {
		if (props.transformOrigin)
			return props.transformOrigin

		if (propVerticalAlignTop.value)
			return propAlignRight.value ? 'bottom right' : 'bottom left'
		else
			return propAlignRight.value ? 'top right' : 'top left'
	})

	/**
	 * This is very cool. You can define an empty component that takes in a slot and emits an event.
	 * Which we normally would have to create another component for. Great stuff!
	 */
	const VSlotEmitter = {
		props: { open: { type: Boolean }, },
		watch: {
			open: {
				handler() { this.$emit('changedOpenState') },
				immediate: true
			}
		},
		render: () => createCommentVNode('VSlotEmitter')
	}
</script>

<style lang="postcss" scoped>
	.transition-menu {
		&-enter-active						{ @apply transition duration-100 ease-out }	
		&-enter-from, &-leave-to 	{ @apply transform-gpu scale-95 opacity-0 }
		&-enter-to, &-leave-from 	{ @apply transform-gpu scale-100 opacity-100 }
		&-leave-active 						{ @apply transition duration-75 ease-out }
	}
</style>