<template>
	<Modal 
		:isOpened="isOpened" 
		:hasPadding="false" 
		:displayTitle="false"
		@close="$emit('close')"
		title="Edit note"
		forceMobileFullHeight>

		<NoteEditor displayInModal />
	</Modal>
</template>

<script setup>
	import { ref } from 'vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import { Modal } from '@/components/ui'
	
	defineProps({
		isOpened: { type: Boolean, required: true },
	})

	defineEmits([ 'close' ])
</script>