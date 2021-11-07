<template>
	<component 
		:is="is"
		:type="type"
		:disabled="isDisabled || isLoading"
		:class="{
			[ 'Button-' + buttonType ]: true,
			isFullWidth,
			isLoading,
			hasNegativeMargin,
			isDisabled,
			[ customRoundedBorderClass ]: customRoundedBorderClass,
			_isIconOnly
		}"
		class="Button">

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
			class="-mx-1 transition-transform" :class="{ 'transform-gpu rotate-x-180': isDropdownOpened }"
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
		customRoundedBorderClass: 	{ type: String, default: 'rounded-button' },
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
		@apply relative inline-flex items-center justify-center gap-2;
		@apply font-bold text-100;
		@apply transition duration-100;
		@apply w-full desktop:w-fit;
		@apply border;

		/**
		 * Types
		 */
		&-primary, 
		&-secondary, 
		&-tertiary {
			transition: border-color 750ms ease, background-color 100ms ease;
			
			@apply px-4 h-11;
			&.hasNegativeMargin { @apply -mx-4 -my-3; }
		}

		&-primary {
			@apply text-gray-1000;
			@apply border-transparent;
			@apply bg-green-400;

			&:hover {
				@apply desktop:bg-opacity-80;
			}

			&:active {
				@apply border-green-200 bg-opacity-70;
				transition: border-color 0ms ease, background-color 0ms ease;
			}
		}

		&-secondary, 
		&-tertiary {
			@apply text-gray-400;
			@apply border-gray-750-standaloneBorder;
			@apply bg-gray-800 bg-opacity-0;

			&:hover {
				@apply desktop:bg-opacity-40;
			}

			&:active {
				@apply border-gray-600 bg-opacity-80;
				transition: border-color 0ms ease, background-color 0ms ease;
			}
		}

		&-tertiary {
			@apply border-transparent;

			&:active {
				@apply border-gray-700;
			}
		}

		&-inline {
			@apply border-none text-green-400 font-bold underline;
			@apply !rounded-none;
			transition: color 100ms ease;

			&:hover {
				@apply desktop:text-opacity-75;
			}

			&:active {
				@apply text-opacity-50;
				transition: color 0ms ease;
			}
		}


		/** 
		 * Other props
		 */
		&.isFullWidth {
			@apply w-full flex !important;
		}

		&.isLoading, &.isDisabled {
			@apply pointer-events-none;
		}

		&.isDisabled {
			@apply opacity-25 select-none;
		}

		&._isIconOnly {
			@apply flex justify-center items-center flex-shrink-0 text-gray-500; 

			@apply h-9 w-9 p-0;
			&.hasNegativeMargin { @apply -m-2; }
		}
	}
</style>