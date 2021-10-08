<template>
	<MenuItem v-slot="{ active }" v-bind="$attrs">
		<Cell class="cursor-pointer" :isFocused="active" v-bind="{ ...cellProps, dividerInset: true }">
			<slot />
		</Cell>
	</MenuItem>
</template>

<script setup>
	import { computed, useSlots } from 'vue'
	import { MenuItem } from '@headlessui/vue'
	import { Cell } from '@/components/ui'
	import { IconCheck } from '@/assets/icons'

	defineProps({
		...MenuItem.props,
		cellProps: { type: Object, default: () => ({}) },
	})

	const slots = useSlots()
	const iconSlotVisible = computed(() => slots.icon?.())
</script>