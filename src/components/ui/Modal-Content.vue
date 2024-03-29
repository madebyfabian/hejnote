<template>
	<CFocusLock v-bind="{ allowOutsideClick: true, autoFocus: !isMobileDevice }">
		<div class="Modal" :class="{ isConfirm, isMobileFullHeight }" @mousedown.self="emit('close')">
			<div 
				class="Modal-container"
				:class="[ hasPadding && 'hasPadding', widthClass ]"
				role="dialog"
				v-scroll-lock="true"
				aria-modal="true">

				<div class="Modal-header" v-if="displayTitle" v-text="title" />
				
				<component :is="isForm ? 'form' : 'div'" @submit.prevent="e => $emit('formSubmit', e)">
					<div class="Modal-content" :class="{ 'flex-1': isMobileFullHeight }">
						<slot />
					</div>

					<div class="Modal-bottomBar" v-if="!isBottomBarSlotEmpty" >
						<slot name="bottomBar" />
					</div>
				</component>

				<div v-if="displayCloseButton" class="absolute right-5 top-5 z-60">
					<ButtonIconOnly @click="() => $emit('close')" :icon="IconClose">
						Close modal
					</ButtonIconOnly>
				</div>
			</div>
		</div>
	</CFocusLock>
</template>

<script setup>
	import { onUnmounted, computed } from 'vue'
	import { ButtonIconOnly } from '@/components/ui'
	import { IconClose } from '@/assets/icons'
	import { CFocusLock } from '@chakra-ui/c-focus-lock'
	import useSlotIsEmpty from '@/hooks/useSlotIsEmpty'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'

	const emit = defineEmits([ 'close', 'formSubmit' ])

	const props = defineProps({
		isOpened: 							{ type: Boolean, required: true },
		hasPadding: 						{ type: Boolean, default: true },
		title: 									{ type: String, required: true },
		displayTitle: 					{ type: Boolean, default: true },
		displayCloseButton: 		{ type: Boolean, default: true },
		isConfirm: 							{ type: Boolean, default: false },
		forceMobileFullHeight: 	{ type: Boolean, default: false },
		width: 									{ type: String, default: '200', validator: v => [ '100', '200' ].includes(v) },
		isForm: 								{ type: Boolean, default: false },
	})

	const isBottomBarSlotEmpty = useSlotIsEmpty({ name: 'bottomBar' })
	const isMobileDevice = useIsMobileDevice()

	const isMobileFullHeight = computed(() => {
		if (props.isConfirm)
			return false
		
		return props.forceMobileFullHeight || false
	})

	const widthClass = computed(() => {
		if (props.width === '100' || props.isConfirm)
			return 'desktop:max-w-sm'

		if (props.width === '200' || !props.isConfirm)
			return 'desktop:max-w-lg'
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
		@apply bg-gray-1000 bg-opacity-85 flex justify-center;
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
			@apply bg-gray-900 relative flex flex-col w-full overflow-hidden rounded-t-2xl desktop:rounded-2xl z-0 overflow-y-auto;
			
			max-height: 100%;
			-webkit-overflow-scrolling: touch;

			/** Even when hasPadding=false, the safe area padding should appear. */
			@apply pb-safe-area-bottom desktop:pb-0 !important;

			&.hasPadding {
				@apply p-6;
				@apply desktop:pb-6 !important;
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
		@apply transition-opacity duration-300 desktop:duration-150;

		.Modal-container {
			@apply transition-transform duration-300 desktop:duration-150;
		}
	}
	.transition-modalSlideIn-leave-active {
		@apply transition-opacity duration-150 desktop:duration-100;

		.Modal-container {
			@apply transition-transform duration-150 desktop:duration-100;
		}
	}
	.transition-modalSlideIn-enter-from, .transition-modalSlideIn-leave-to {
		@apply opacity-0;

		.Modal-container {
			@apply transform-gpu translate-y-8 desktop:translate-y-2;
		}
	}
</style>