<template>
	<component 
		:is="tag" 
		:to="tag && to"
		:class="isActive ? 'text-green-400' : 'text-gray-500'"
		class="TabNav-Item relative flex flex-col items-center gap-1 w-20 rounded-xl pt-3 pb-2 px-2 flex-shrink-0 transition-colors">

		<slot name="icon" />

		<span class="text-050" >
			<slot />
		</span>
	</component>
</template>

<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		isActive: { type: Boolean, default: false },
		to: 			{ type: Object, default: undefined },
	})

	const tag = computed(() => props.to ? 'router-link' : 'button')
</script>