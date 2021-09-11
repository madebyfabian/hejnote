<template>
	<component 
		class="Cell" 
		:is="isClickable ? 'a' : 'div'"
		:href="isClickable ? '#' : ''"
		:class="{ isClickable }">

		<span v-if="iconSlotVisible" class="Cell-icon"><slot name="icon" /></span>
		<span class="text-100"><slot /></span>
	</component>
</template>

<script setup>
	import { computed, useSlots } from 'vue'

	defineProps({
		isClickable: { type: Boolean, default: false },
	})

	const slots = useSlots()
	const iconSlotVisible = computed(() => slots.icon?.())
</script>

<style lang="postcss" scoped>
	.Cell {
		@apply py-1.5 px-4 flex items-center w-full;
		@apply transition duration-150;

		&.isClickable:hover {
			@apply bg-gray-700;
		}

		&-icon {
			@apply mr-3;
		}
	}
</style>