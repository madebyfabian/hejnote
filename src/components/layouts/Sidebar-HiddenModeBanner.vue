<template>
	<transition name="transition-HiddenModeBanner">
		<div v-if="isDisplayed" class="Sidebar-HiddenModeBanner fixed w-full bottom-0 left-0 h-15 z-0 select-none" role="banner">
			<div class="container h-full">
				<div class="bg-green-400 rounded-t-xl flex items-center justify-center h-full text-gray-900">
					<p>Only hidden notes are currently displayed</p>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
	defineProps({
		isDisplayed: { type: Boolean, required: true }
	})
</script>

<style lang="postcss" scoped>
	/** Transitions */
	.transition-HiddenModeBanner-enter-active,
	.transition-HiddenModeBanner-leave-active {
		@apply duration-225;
		transition-property: opacity, transform;
		transition-timing-function: ease;
	}
	.transition-HiddenModeBanner-enter-from,
	.transition-HiddenModeBanner-leave-to {
		opacity: 0;
		transform: translateY(0.5rem);
	}
</style>