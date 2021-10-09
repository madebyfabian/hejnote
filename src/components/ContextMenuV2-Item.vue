<template>
	<MenuItem v-slot="{ active }" v-bind="$attrs">
		<Cell class="cursor-pointer" :isFocused="active" v-bind="{ ...cellProps, dividerInset: true }">
			<slot />
		</Cell>
	</MenuItem>
</template>

<script setup>
	import { MenuItem } from '@headlessui/vue'
	import { Cell } from '@/components/ui'

	defineProps({
		...MenuItem.props,
		cellProps: { type: Object, default: () => ({}) },
	})
</script>