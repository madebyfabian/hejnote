<template>
	<transition name="transition-modalSlideIn">
		<Modal-Content v-if="isOpened" v-bind="$props">
			<slot />
			<template #bottomBar>
				<slot name="bottomBar"/>
			</template>
		</Modal-Content>
  </transition>
</template>

<script setup>
	import ModalContent from '@/components/Modal-Content.vue'

	defineProps({
		isOpened: 					{ type: Boolean, required: true },
		hasPadding: 				{ type: Boolean, default: true },
		title: 							{ type: String, required: true },
		displayTitle: 			{ type: Boolean, default: true },
		displayCloseButton: { type: Boolean, default: true },
	})
</script>