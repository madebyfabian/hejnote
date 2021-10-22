<template>
	<component 
		:is="is"
		:type="type"
		:disabled="isDisabled || isLoading"
		:class="[
			buttonType == 'primary' && 'isPrimary', 
			buttonType == 'secondary' && 'isSecondary',
			buttonType == 'tertiary' && 'isTertiary',
			buttonType == 'inline' && 'isInline',
			_isIconOnly && '_isIconOnly',
			isText050 && 'isText050',
			hideBorder && 'hideBorder',
			fitToArea && 'fitToArea',
			isFullWidth && 'isFullWidth',
			noRoundedBorder && 'noRoundedBorder',
			displayAsDropdownOpened && 'displayAsDropdownOpened',
			isDisabled && 'isDisabled',
			hasNegativeMargin && 'hasNegativeMargin',
			isLoading && 'isLoading'
		]"
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
			v-if="displayAsDropdown" 
			aria-hidden="true"
			class="-ml-1 transition-transform" :class="{ 'transform-gpu rotate-x-180': displayAsDropdownOpened }"
			style="-webkit-backface-visibility: initial">

			<IconChevron />
		</div>
	</component>
</template>

<script setup>
	import { IconChevron } from '@/assets/icons'
	import { LoadingSpinner } from '@/components/ui'

	defineProps({
		is: 											{ type: String, default: 'button' },
		type: 										{ type: String, default: undefined },
		buttonType:								{ type: String, default: 'primary', validate: val => [ 'primary', 'secondary', 'tertiary', 'inline' ].includes(val) },
		isText050: 								{ type: Boolean, default: false },
		hideBorder:								{ type: Boolean, default: false },
		noRoundedBorder: 					{ type: Boolean, default: false },
		fitToArea: 								{ type: Boolean, default: false },
		isFullWidth: 							{ type: Boolean, default: false },
		displayAsDropdown: 				{	type: Boolean, default: false },
		displayAsDropdownOpened: 	{ type: Boolean, default: false },
		isDisabled: 							{ type: Boolean, default: false },
		hasNegativeMargin: 				{ type: Boolean, default: false },
		isLoading: 								{ type: Boolean, default: false },

		// Should not be used by layouts other than <Button...> helpers (e.g. "ButtonIconOnly")
		_isIconOnly:							{ type: Boolean, default: false },
	})
</script>

<style lang="postcss" scoped>
	.Button {
		@apply relative inline-flex items-center justify-center gap-2;
		@apply h-11 border font-bold;
		@apply transition duration-100;
		@apply w-full desktop:w-fit;

		/** Margin & Padding */
		@apply px-4;
		&.hasNegativeMargin { @apply -mx-4; }

		/** Text */
		&.isText050 { @apply text-050; }
		&:not(.isText050) { @apply text-100; }


		/**
		 * Types
		 */
		&.isPrimary {
			@apply rounded-xl border-transparent bg-green-400 text-gray-900;

			&:hover {
				@apply bg-opacity-75 text-opacity-75;
			}
		}

		&.isSecondary {
			@apply rounded-xl border-gray-700 text-gray-400;

			&:hover {
				@apply bg-gray-700;
			}
		}

		&.isTertiary {
			@apply border-none bg-transparent h-auto text-gray-400;

			&:hover {
				@apply text-gray-400;
			}
		}

		&.isInline {
			@apply border-none text-green-400 font-bold underline h-auto p-0;

			&:hover {
				@apply text-opacity-75;
			}
		}


		/** 
		 * Other props
		 */
		&._isIconOnly {
			@apply flex justify-center items-center flex-shrink-0 text-gray-500; 

			@apply h-9 w-9 p-0;
			&.hasNegativeMargin { @apply -m-2; }
		}

		&.hideBorder {
			@apply border-transparent;
		}

		&.fitToArea {
			@apply h-auto w-auto;

			@apply px-3;
			&.hasNegativeMargin { @apply -mx-3; }
		}

		&.isFullWidth {
			@apply w-full flex !important;
		}

		&.noRoundedBorder {
			@apply rounded-none;
		}

		&.isDisabled {
			@apply opacity-25;
		}

		&.isLoading, &.isDisabled {
			@apply pointer-events-none;
		}
	}
</style>