<template>
	<div 
		class="Snackbar"
		ref="snackbarRef"
		:style="{ '--snackbar-max-height': `${ snackbarMaxHeight }px` }">

		<div class="Snackbar-inner">
			<button 
				v-html="snackbar.message"
				class="Snackbar-content"
				:class="{ 'border-r border-gray-700': snackbar.buttonText }"
				@click.self="$emit('removeSnackbar')"
				role="status"
				aria-label="Close this message"
			/>

			<Button 
				v-if="snackbar.buttonText"
				buttonType="tertiary"
				customRoudedBorderClass="rounded-none rounded-r-xl"
				@click="handleButtonClick"
				class="!h-auto !w-auto !px-3">
				
				{{ snackbar.buttonText }}
			</Button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { Button } from '@/components/ui'

	const snackbarRef = ref(null)
	const snackbarMaxHeight = computed(() => snackbarRef?.value?.scrollHeight)

	const emit = defineEmits([ 'removeSnackbar', 'buttonClick' ])

	const props = defineProps({
		snackbar: { type: Object, required: true }
	})

	const handleButtonClick = () => {
		emit('removeSnackbar')
		props.snackbar?.onButtonClick?.()
	}
</script>

<style lang="postcss" scoped>
	.Snackbar {
		@apply relative select-none;

		&::after {
			@apply absolute rounded-xl bg-gray-800 border border-gray-700 w-full z-0 left-0 top-4 pointer-events-none;
			content: '';
			height: calc(var(--snackbar-max-height) - 16px);
		}
	}

	.Snackbar-inner {
		@apply relative pt-4 text-white overflow-hidden cursor-pointer z-1 flex;
		will-change: transform, opacity, max-height;

		.Snackbar-content {
			@apply block w-full text-left px-4 py-3 relative z-1 flex-1;
		}
	}
</style>