<template>
	<component 
		:is="is"
		:type="type"
		:disabled="isDisabled"
		:class="[
			buttonType == 'primary' && 'isPrimary', 
			buttonType == 'secondary' && 'isSecondary',
			buttonType == 'tertiary' && 'isTertiary',
			buttonType == 'inline' && 'isInline',
			isIconOnly && 'isIconOnly',
			hideBorder && 'hideBorder',
			fitToArea && 'fitToArea',
			isFullWidth && 'isFullWidth',
			noRoundedBorder && 'noRoundedBorder',
			displayAsDropdownOpened && 'displayAsDropdownOpened',
			isDisabled && 'isDisabled',
			hasNegativeMargin && 'hasNegativeMargin',
		]"
		class="Button">

		<slot />

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

	defineProps({
		is: 											{ type: String, default: 'button' },
		type: 										{ type: String, default: undefined },
		buttonType:								{ type: String, default: 'primary', 
																validate: val => [ 'primary', 'secondary', 'tertiary', 'inline' ].includes(val) },
		isIconOnly:								{ type: Boolean, default: false },
		hideBorder:								{ type: Boolean, default: false },
		noRoundedBorder: 					{ type: Boolean, default: false },
		fitToArea: 								{ type: Boolean, default: false },
		isFullWidth: 							{ type: Boolean, default: false },
		displayAsDropdown: 				{	type: Boolean, default: false },
		displayAsDropdownOpened: 	{ type: Boolean, default: false },
		isDisabled: 							{ type: Boolean, default: false },
		hasNegativeMargin: 				{ type: Boolean, default: false },
	})
</script>

<style lang="postcss" scoped>
	.Button {
		@apply inline-flex items-center justify-center gap-2;
		@apply h-11 rounded-xl border font-bold text-100;
		@apply transition duration-100;
		@apply w-full desktop:w-fit;

		@apply px-4;
		&.hasNegativeMargin { @apply -mx-4; }
		
		/**
		 * Types
		 */
		&.isPrimary {
			@apply border-transparent bg-green-400 text-gray-900;

			&:hover, &.displayAsDropdownOpened {
				@apply bg-opacity-75 text-opacity-75;
			}
		}

		&.isSecondary {
			@apply border-gray-700 text-gray-300;

			&:hover, &.displayAsDropdownOpened {
				@apply bg-gray-700;
			}
		}

		&.isTertiary {
			@apply border-none bg-transparent h-auto text-gray-300;

			&:hover, &.displayAsDropdownOpened {
				@apply text-gray-400;
			}
		}

		&.isInline {
			@apply border-none text-green-400 font-bold underline;

			&:hover, &.displayAsDropdownOpened {
				@apply text-opacity-75;
			}
		}


		/** 
		 * Other props
		 */
		&.isIconOnly {
			@apply flex justify-center items-center flex-shrink-0; 

			@apply h-9 w-9 p-0;
			&.hasNegativeMargin { @apply -mx-1.5; }
		}

		&.hideBorder {
			@apply border-transparent text-gray-500;
		}

		&.fitToArea {
			@apply h-auto;

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
			@apply pointer-events-none opacity-25;
		}
	}
</style>