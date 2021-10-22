<template>
	<div class="TextInput">
		<span v-if="!isIconSlotEmpty" class="TextInput-icon absolute left-4 top-3 pointer-events-none" aria-hidden="true">
			<slot name="icon" />
		</span>

		<input
			@input="$emit('update:modelValue', $event.target.value)"
			v-bind="{ ...inputProps, value: modelValue }"
			:class="!isIconSlotEmpty ? 'pl-11' : 'pl-5'"
		/>
	</div>
</template>

<script setup>
	import useSlotIsEmpty from '@/hooks/useSlotIsEmpty'

	defineProps({
		modelValue: 	{ required: true },
		placeholder: 	{ type: String, default: '' },

		// new:
		inputProps: 	{ type: Object, default: () => ({}) },
	})

	const isIconSlotEmpty = useSlotIsEmpty({ name: 'icon' })
</script>

<style lang="postcss" scoped>
	.TextInput {
		@apply relative;

		&-icon, input::placeholder {
			@apply text-gray-500;
		}

		input {
			@apply inline-flex w-full bg-transparent h-11 rounded-xl border border-gray-700;
			@apply text-100 text-base desktop:text-sm;
			@apply transition duration-300;
			@apply ring-0;
		}
	}

	
</style>