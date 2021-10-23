<template>
	<component 
		:is="is"
		:type="type"
		:disabled="isDisabled || isLoading"
		class="Button"
		tabindex="0"
		:class="{
			[ 'Button-' + buttonType ]: true,
			noRoundedBorder,
			isFullWidth,
			isLoading,
			hasNegativeMargin,
			isDisabled,
			_isIconOnly
		}">

		<span 
			class="transition-opacity inline-flex items-center justify-center gap-2 flex-shrink-0"
			:class="isLoading ? 'opacity-0' : 'opacity-100'"
			:aria-hidden="isLoading ? true : false">

			<slot />
		</span>

		<transition name="transition-fade-100">
			<div 
				v-if="isLoading"
				class="absolute left-0 top-0 h-full w-full flex items-center justify-center pointer-events-none">

				<LoadingSpinner />
			</div>
		</transition>

		<div
			v-if="typeof isDropdownOpened === 'boolean'" 
			aria-hidden="true"
			class="-ml-1 transition-transform" :class="{ 'transform-gpu rotate-x-180': isDropdownOpened }"
			style="-webkit-backface-visibility: initial">

			<IconChevron />
		</div>
	</component>
</template>

<script setup>
	import { computed } from 'vue'
	import { IconChevron } from '@/assets/icons'
	import { LoadingSpinner } from '@/components/ui'

	defineProps({
		// <button> native element props
		is: 											{ type: String, default: 'button' },
		type: 										{ type: String, default: undefined },
		isDisabled: 							{ type: Boolean, default: false },

		// Custom props
		buttonType:								{ type: String, default: 'primary', validate: val => [ 'primary', 'secondary', 'tertiary', 'inline' ].includes(val) },
		noRoundedBorder: 					{ type: Boolean, default: false },
		isFullWidth: 							{ type: Boolean, default: false },
		isLoading: 								{ type: Boolean, default: false },
		hasNegativeMargin: 				{ type: Boolean, default: false },
		isDropdownOpened:					{ type: [ Boolean, undefined ], default: undefined },		

		// Should not be used by layouts other than <Button...> helpers (e.g. "ButtonIconOnly")
		_isIconOnly:							{ type: Boolean, default: false },
	})
</script>

<style lang="postcss" scoped>
	.Button {
		@apply relative inline-flex items-center justify-center gap-2 h-11;
		@apply font-bold text-100;
		@apply transition duration-100;
		@apply w-full desktop:w-fit;
		@apply border;

		/**
		 * Types
		 */
		&-primary {
			@apply rounded-xl border-transparent bg-green-400 text-gray-900;

			&:hover {
				@apply bg-opacity-75 text-opacity-75;
			}
		}

		&-secondary, &-tertiary {
			@apply rounded-xl border-gray-700 text-gray-400;
			@apply bg-gray-700 bg-opacity-0;
			transition: border-color 750ms ease, background-color 100ms ease;

			&:hover {
				@apply bg-opacity-25;
			}

			&:active {
				@apply border-gray-500 bg-opacity-75;
				transition: border-color 0ms ease, background-color 0ms ease;
			}
		}

		&-tertiary {
			@apply border-transparent;

			&:active {
				@apply border-gray-600;
			}
		}

		&-inline {
			@apply border-none text-green-400 font-bold underline h-auto p-0;

			&:hover {
				@apply text-opacity-75;
			}
		}


		/** 
		 * Other props
		 */
		&.noRoundedBorder {
			@apply rounded-none;
		}

		&.isFullWidth {
			@apply w-full flex !important;
		}

		&.isLoading, &.isDisabled {
			@apply pointer-events-none;
		}

		&.isDisabled {
			@apply opacity-25;
		}

		@apply px-4;
		&.hasNegativeMargin { @apply -mx-4; }

		&._isIconOnly {
			@apply flex justify-center items-center flex-shrink-0 text-gray-500; 

			@apply h-9 w-9 p-0;
			&.hasNegativeMargin { @apply -m-2; }
		}
	}
</style>