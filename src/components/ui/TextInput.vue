<template>
	<div class="TextInput">
		<span v-if="!isIconSlotEmpty" class="TextInput-icon absolute left-4 top-3 pointer-events-none" aria-hidden="true">
			<slot name="icon" />
		</span>

		<input
			@input="emit('update:modelValue', $event.target.value)"
			v-bind="{ ...inputProps, value: modelValue }"
			:class="{
				'pl-11': !isIconSlotEmpty,
				'pl-5': isIconSlotEmpty,
				'bg-gray-800': inputBgGray,
				'bg-transparent': !inputBgGray,
				'border border-gray-700': !inputBorderHidden,
				'border border-transparent': inputBorderHidden,
			}"
			ref="inputEl"
		/>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue'
	import useSlotIsEmpty from '@/hooks/useSlotIsEmpty'

	const emit = defineEmits([ 'mountedInput', 'update:modelValue' ])

	defineProps({
		modelValue: 				{ required: true },
		inputBgGray: 				{ type: Boolean, default: false },
		inputBorderHidden: 	{ type: Boolean, default: false },

		// new:
		inputProps: 				{ type: Object, default: () => ({}) },
	})

	const inputEl = ref(null)
	const isIconSlotEmpty = useSlotIsEmpty({ name: 'icon' })

	onMounted(() => {
		emit('mountedInput', { inputEl: inputEl.value })
	})
</script>

<style lang="postcss" scoped>
	.TextInput {
		@apply relative;

		&-icon, input::placeholder {
			@apply text-gray-500;
		}

		input {
			@apply inline-flex w-full h-11 rounded-input;
			@apply text-100 text-base desktop:text-sm;
			@apply transition duration-300;
			@apply ring-0;
		}
	}
</style>