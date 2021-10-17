<template>
	<label class="Switch" :class="{ isChecked: value }">
		<!-- Exeption: I didn't used <Button> here, but it's okay -->
		<button 
			type="button" 
			role="switch" 
			class="Switch-button"
			:aria-checked="value"
			:aria-label="label"
			@click="$emit('change', !value)">

			<span class="sr-only">{{ value ? 'On' : 'Off' }}</span>
		</button>

		<span class="Switch-label" v-text="label" />
	</label>
</template>

<script setup>
	defineProps({
		value: { type: Boolean, required: true },
		label: { type: String, required: true },
	})
</script>

<style lang="postcss" scoped>
	.Switch {
		@apply flex items-center gap-2 cursor-pointer select-none p-3 rounded-xl transition duration-225;

		/** 
		 * Element Styles 
		 */
		&-button, &-label {
			@apply transition duration-225;
		}

		&-button {
			@apply h-6 w-9 rounded-full relative;
			@apply bg-gray-800 border border-gray-700;

			&::after {
				@apply transition-transform-bg duration-225;
				@apply block rounded-full w-4 h-4 absolute top-0.5 left-0.5;
				@apply bg-gray-500;
				content: '';
			}
		}

		&-label {
			@apply text-gray-500;
		}


		/** 
		 * .isChecked modifier styles
		 */
		&.isChecked &-label {
			@apply text-green-400;
		}

		&.isChecked &-button {
			@apply bg-green-900 border-green-800;

			&::after {
				@apply bg-green-400 transform-gpu translate-x-3;
			}
		}


		/** 
		 * :hover modifier styles
		 */
		&:hover {
			@apply bg-gray-800;
		}

		&:not(.isChecked):hover &-button::after {
			@apply bg-gray-400;
		}
		&:not(.isChecked):hover &-label {
			@apply text-gray-400;
		}

		&.isChecked:hover &-button::after {
			@apply bg-green-300;
		}
		&.isChecked:hover &-label {
			@apply text-green-300;
		}
	}
</style>