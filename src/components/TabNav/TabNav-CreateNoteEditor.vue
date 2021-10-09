<template>
	<Modal 
		:isOpened="isOpened" 
		:hasPadding="false" 
		:displayTitle="false"
		@close="$emit('close')"
		title="Edit note"
		forceFullHeight>

		<NoteEditor displayInModal />
	</Modal>
</template>

<script setup>
	import { ref } from 'vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import Modal from '@/components/Modal.vue'
	
	defineProps({
		isOpened: { type: Boolean, required: true },
	})

	defineEmits([ 'close' ])
</script>