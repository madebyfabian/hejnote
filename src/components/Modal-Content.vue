<template>
	<CFocusLock>
		<div class="Modal" @mousedown.self="emit('close')">
			<div 
				class="Modal-container"
				:class="{ hasPadding }"
				role="dialog"
				aria-modal="true">

				<div class="Modal-header" v-if="displayTitle" v-text="title" />
				
				<div class="Modal-content">
					<slot />
				</div>

				<div v-if="displayCloseButton" class="absolute right-5 top-5">
					<Button @click="emit('close')" isIconOnly buttonType="secondary">
						<IconClose />
					</Button>
				</div>

				<div class="Modal-bottomBar" v-if="hasBottomBar" >
					<slot name="bottomBar" />
				</div>
			</div>
		</div>
	</CFocusLock>
</template>

<script setup>
	import { useSlots, ref, onUnmounted, computed } from 'vue'
	import { Button } from '@/components/ui'
	import { IconClose } from '@/assets/icons'
	import { CFocusLock } from '@chakra-ui/c-focus-lock'

	const emit = defineEmits([ 'close' ])

	const slots = useSlots()
	const hasBottomBar = ref(false)
	if (slots.bottomBar()?.[0].children.length)
		hasBottomBar.value = true

	defineProps({
		isOpened: 					{ type: Boolean, required: true },
		hasPadding: 				{ type: Boolean, default: true },
		title: 							{ type: String, required: true },
		displayTitle: 			{ type: Boolean, default: true },
		displayCloseButton: { type: Boolean, default: true },
	})

	const handler = (e) => {
		if (e.key.toUpperCase() === 'ESCAPE')
			emit('close')
	}

	document.addEventListener('keydown', handler)
	onUnmounted(() => {
		document.removeEventListener('keydown', handler)
	})
</script>

<style lang="postcss" scoped>
	.Modal {
		@apply fixed h-full w-full top-0 left-0 z-50;
		@apply py-10;
		@apply bg-gray-900 bg-opacity-75 flex justify-center items-center;

		&-container {
			@apply bg-gray-800 relative flex flex-col w-full overflow-hidden max-w-lg rounded-2xl z-0 overflow-y-auto;
			
			max-height: 100%;
			-webkit-overflow-scrolling: touch;

			&.hasPadding {
				@apply p-6;
			}
		}

		&-header {
			@apply flex justify-between text-200 font-bold text-gray-300 pr-12 mb-4;
		}

		&-bottomBar {
			@apply flex justify-end items-center mt-8 gap-3;
		}
	}


	/** Transition */
	.transition-modalSlideIn-enter-active {
		@apply transition-opacity duration-300;

		.Modal-container {
			@apply transition-transform duration-300;
		}
	}
	.transition-modalSlideIn-leave-active {
		@apply transition-opacity duration-150;

		.Modal-container {
			@apply transition-transform duration-150;
		}
	}
	.transition-modalSlideIn-enter-from, .transition-modalSlideIn-leave-to {
		@apply opacity-0;

		.Modal-container {
			@apply transform-gpu translate-y-2;
		}
	}
</style>