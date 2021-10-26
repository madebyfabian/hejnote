<template>
	<transition name="transition-fadeAndScale-medium">
		<div 
			v-if="isVisible" 
			role="banner"
			class="BannerHiddenMode">

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

<style lang="postcss" scoped>
	.BannerHiddenMode {
		@apply fixed z-50 left-0 w-full bg-green-400;
		@apply bottom-0 desktop:bottom-initial desktop:top-0;
		@apply pt-2 desktop:pt-1.5 pb-7 desktop:pb-1.5;
		@apply rounded-t-xl desktop:rounded-t-none desktop:rounded-b-xl;
	}
</style>