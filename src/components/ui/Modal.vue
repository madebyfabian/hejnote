<template>
	<teleport to="body">
		<transition name="transition-modalSlideIn">
			<Modal-Content v-if="isOpened" v-bind="$props" @close="$emit('close')">
				<slot />
				<template #bottomBar>
					<slot name="bottomBar"/>
				</template>
			</Modal-Content>
		</transition>
	</teleport>
</template>

<script setup>
	import { ModalContent } from '@/components/ui'

	defineEmits(ModalContent.emits)
	defineProps({ ...ModalContent.props })
</script>