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
		...ModalContent.props,
	})
</script>