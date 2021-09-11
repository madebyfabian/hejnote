<template>
	<div class="SnackbarContainer">
		<transition-group name="transition-snackbar" tag="div">
			<Snackbar 
				v-for="snackbar of snackbarInstances" :key="snackbar.id"
				:snackbar="snackbar"
				@removeSnackbar="removeSnackbar({ id: snackbar.id })"
			/>
		</transition-group>
	</div>
</template>

<script setup>
	import useSnackbar from '@/hooks/useSnackbar'
	import Snackbar from '@/components/Snackbar.vue'

	const { snackbarInstances, removeSnackbar } = useSnackbar()
</script>

<style lang="postcss" scoped>
	.SnackbarContainer {
		@apply flex flex-col-reverse items-center fixed bottom-6 left-6 max-w-sm w-full z-50;

		> div {
			@apply w-full;
		}
	}

	/** Transitions */
	.transition-snackbar-enter-active,
	.transition-snackbar-leave-active {
		@apply duration-225;
		transition-property: max-height, opacity, transform;
		transition-timing-function: ease;
		max-height: var(--snackbar-max-height);
	}
	.transition-snackbar-enter-from,
	.transition-snackbar-leave-to {
		opacity: 0;
		max-height: 0;
		transform: translateY(8px);
	}
</style>