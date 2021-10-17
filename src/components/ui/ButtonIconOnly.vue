<template>
	<Button
		class="ButtonIconOnly"
		v-bind="{
			isDisabled: $props.isDisabled,
			is: $props.is,
			hideBorder: $props.isInline,
			hasNegativeMargin: $props.isInline,
			buttonType: 'secondary',
			isIconOnly: true,
		}">

		<component :is="$props.icon" />

		<span class="sr-only">
			<slot />
		</span>
	</Button>
</template>

<script setup>
	import { computed, onMounted, useSlots } from 'vue'
	import { Button } from '@/components/ui'

	defineProps({
		// Button Props
		isDisabled: Button.props.isDisabled,
		is: Button.props.is,

		// Local Props
		icon: 		{ required: true },
		isInline: { type: Boolean, default: false }
	})

	onMounted(() => {
		if (!useSlots()?.default?.())
			console.warn('No default slot provided for A11Y Label of this button. Please provide a slot with some text.')
	})
</script>