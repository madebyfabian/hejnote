<template>
	<div class="Marker" :class="{ isActive }" />
</template>

<script>
	export default {
		props: {
			isActive: { type: Boolean, default: false },
		}
	}
</script>

<style lang="postcss" scoped>
	.Marker {
		@apply m-0.5 h-2 w-2 rounded-full bg-transparent border border-gray-600;
		@apply transition;

		&.isActive {
			@apply border-transparent bg-green-400;
		}
	}
</style>