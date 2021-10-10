<template>
	<CFocusLock>
		<div class="Modal" :class="{ isConfirm, isMobileFullHeight }" @mousedown.self="emit('close')">
			<div 
				class="Modal-container"
				:class="{ hasPadding, 'desktop:max-w-lg': !isConfirm, 'desktop:max-w-sm': isConfirm }"
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

	const props = defineProps({
		isOpened: 							{ type: Boolean, required: true },
		hasPadding: 						{ type: Boolean, default: true },
		title: 									{ type: String, required: true },
		displayTitle: 					{ type: Boolean, default: true },
		displayCloseButton: 		{ type: Boolean, default: true },
		isConfirm: 							{ type: Boolean, default: false },
		forceMobileFullHeight: 	{ type: Boolean, default: false },
	})

	const isMobileFullHeight = computed(() => {
		if (props.isConfirm)
			return false
		
		return props.forceMobileFullHeight || false
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
		@apply fixed h-full w-full top-0 left-0;
		@apply p-0 pt-7 desktop:py-10;
		@apply bg-gray-900 bg-opacity-75 flex justify-center;
		@apply z-50 items-end desktop:items-center;

		&.isConfirm {
			@apply z-60;
		}

		&.isMobileFullHeight {
			align-items: inherit;
			
			@screen desktop {
				align-items: center;
			}
		}

		&-container {
			@apply bg-gray-800 relative flex flex-col w-full overflow-hidden rounded-t-2xl desktop:rounded-2xl z-0 overflow-y-auto;
			
			max-height: 100%;
			-webkit-overflow-scrolling: touch;

			&.hasPadding {
				@apply p-6 pb-safe-area-bottom desktop:pb-6;
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
			@apply transform-gpu translate-y-8 desktop:translate-y-2;
		}
	}
</style>