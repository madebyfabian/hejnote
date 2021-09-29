<template>
  <input
		:placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
	defineProps({
		modelValue: 	{ required: true },
		placeholder: 	{ type: String, default: '' },
	})
</script>

<style lang="postcss" scoped>
	input {
		@apply inline-flex w-full bg-transparent h-11 pl-5 rounded-xl border border-gray-700;
		@apply text-100 text-base desktop:text-sm;
		@apply transition duration-300;
		@apply ring-0;

		&::placeholder {
			@apply text-gray-500;
		}
	}
</style>