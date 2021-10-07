<template>
	<MenuItem v-slot="{ active }" v-bind="$attrs">
		<Cell :class="{ 'bg-gray-700': active }" class="cursor-pointer">
			<slot />
			
			<template #icon>
				<div class="h-5 w-5">
					<slot v-if="iconSlotVisible" name="icon" />
					<div v-if="displayAsSelected" class="h-5 w-5">
						<IconCheck />
					</div>
				</div>
			</template>
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