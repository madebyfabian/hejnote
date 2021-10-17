<template>
	<Button
		class="ButtonIconOnly"
		v-bind="{
			hideBorder: !!$props.isInline,
			hasNegativeMargin: !!$props.isInline,
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
	import { computed } from 'vue'
	import { Button } from '@/components/ui'

	defineProps({
		// Local Props
		icon: 		{ required: true },
		isInline: { type: Boolean, default: false }
	})
</script>