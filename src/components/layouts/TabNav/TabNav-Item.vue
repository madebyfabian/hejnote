<template>
	<component 
		:is="tag" 
		:to="tag && to"
		:class="isActive ? 'text-green-400' : 'text-gray-500'"
		class="TabNav-Item relative flex flex-col items-center gap-1 px-2 pt-4 flex-shrink-0 w-[20%]">

		<span 
			class="relative transform-gpu duration-300 transition" 
			:class="{ 'translate-y-0': isActive, 'translate-y-2': !isActive }">
		
			<span class="TabNav-Item-icon" :class="{ isActive }">
				<slot name="icon"  />
			</span>

			<span class="absolute top-0 left-0 z-1 transition-opacity" :class="{ 'opacity-0': !isActive }">
				<slot name="activeIcon" />
			</span>
		</span>

		<span 
			class="text-050 font-bold text-overflow-ellipsis max-w-full transform-gpu duration-225 origin-top" 
			:class="{ 'translate-y-0 opacity-100 scale-100': isActive, '-translate-y-2 opacity-0 scale-90': !isActive }">

			<slot />
		</span>
	</component>
</template>

<script setup>
	import { computed } from 'vue'
	import { AppLink } from '@/components/ui'

	const props = defineProps({
		isActive: { type: Boolean, default: false },
		to: 			{ type: Object, default: undefined },
	})

	const tag = computed(() => props.to ? AppLink : 'button')
</script>

<style lang="postcss" scoped>
	.TabNav-Item-icon {
		:deep(svg) {
			@apply transition-opacity;
		}

		&.isActive :deep(svg) {
			@apply opacity-0
		}
	}
</style>

