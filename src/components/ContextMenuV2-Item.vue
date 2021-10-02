<template>
	<MenuItem v-slot="{ active }" v-bind="$attrs">
		<Cell :class="{ 'bg-gray-700': active }" class="cursor-pointer">
			<slot />
		</Cell>
	</MenuItem>
</template>

<script setup>
	import { MenuItem } from '@headlessui/vue'
	import { Cell } from '@/components/ui'
</script>