<template>
	<Button
		class="ButtonIconOnly"
		v-bind="{
			isDisabled: $props.isDisabled,
			is: $props.is,
			hasNegativeMargin: $props.isInline,
			buttonType: $props.isInline ? 'tertiary' : 'secondary',
			_isIconOnly: true,
		}">

		<component :is="$props.icon" />

		<span class="sr-only">
			<slot />
		</span>
	</Button>
</template>

<script setup>
	import { Button } from '@/components/ui'
	import useSlotIsEmpty from '@/hooks/useSlotIsEmpty'

	defineProps({
		// Button Props
		isDisabled: Button.props.isDisabled,
		is: Button.props.is,

		// Local Props
		icon: 		{ required: true },
		isInline: { type: Boolean, default: false }
	})

	if (useSlotIsEmpty().value)
		console.warn('No default slot provided for A11Y Label of this button. Please provide a slot with some text.')
</script>