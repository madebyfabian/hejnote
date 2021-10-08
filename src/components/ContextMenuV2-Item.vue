<template>
	<MenuItem v-slot="{ active }" v-bind="$attrs">
		<Cell class="cursor-pointer" :isFocused="active" :isSelected="displayAsSelected" dividerInset isTypeNavigation>
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
		...Cell.props,
		displayAsSelected: { type: Boolean, default: false },
	})

	const slots = useSlots()
	const iconSlotVisible = computed(() => slots.icon?.())
</script>