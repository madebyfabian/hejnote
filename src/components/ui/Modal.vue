<template>
	<teleport to="#appTeleportRoot">
		<transition name="transition-modalSlideIn">
			<Modal-Content 
				v-if="isOpened" 
				v-bind="$props" 
				@close="$emit('close')"
				@formSubmit="e => $emit('formSubmit', e)">

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