<template>
	<button class="Button" :class="[
		buttonType == 'primary' && 'isPrimary', 
		buttonType == 'secondary' && 'isSecondary',
		buttonType == 'tertiary' && 'isTertiary',
		isIconOnly && 'isIconOnly',
		hideBorder && 'hideBorder',
		fitToArea && 'fitToArea',
		noRoundedBorder && 'noRoundedBorder',
	]">

		<slot />
	</button>
</template>

<script setup>
	defineProps({
		buttonType:				{ type: String, default: 'primary', validate: val => [ 'primary', 'secondary', 'tertiary' ].includes(val) },
		isIconOnly:				{ type: Boolean, default: false },
		hideBorder:				{ type: Boolean, default: false },
		noRoundedBorder: 	{ type: Boolean, default: false },
		fitToArea: 				{ type: Boolean, default: false },
	})
</script>

<style lang="postcss" scoped>
	.Button {
		@apply h-11 px-4 rounded-xl border font-bold text-100 transition duration-100;
		
		/**
		 * Types
		 */
		&.isPrimary {
			@apply border-transparent bg-green-400 text-gray-900;

			&:hover {
				@apply bg-opacity-75 text-opacity-75;
			}
		}

		&.isSecondary {
			@apply border-gray-700 text-gray-300;

			&:hover {
				@apply bg-gray-700;
			}
		}

		&.isTertiary {
			@apply border-none bg-transparent h-auto text-green-400;

			&:hover {
				@apply text-green-500;
			}
		}


		/** 
		 * Other props
		 */
		&.isIconOnly {
			@apply h-9 w-9 p-0 flex justify-center items-center; 
		}

		&.hideBorder {
			@apply border-transparent text-gray-500;
		}

		&.fitToArea {
			@apply h-auto px-3;
		}

		&.noRoundedBorder {
			@apply rounded-none;
		}
	}
</style>