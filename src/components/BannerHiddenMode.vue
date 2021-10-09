<template>
	<transition name="transition-fadeAndScale-medium">
		<div 
			v-if="isVisible" 
			class="BannerHiddenMode fixed z-50 top-0 left-0 w-full pt-9 desktop:pt-1.5 pb-1.5 bg-green-400 rounded-b-xl">
			
			<span class="text-050 flex items-center w-full justify-center gap-1.5 text-gray-900 font-bold">
				<IconEyeOff class="h-4 w-4" />
				Hidden mode activated
			</span>
		</div>
	</transition>
</template>

<script setup>
	import { IconEyeOff } from '@/assets/icons'

	defineProps({
		isVisible: { type: Boolean, default: false, },
	})
</script>