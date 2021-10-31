<template>
	<Modal 
		:isOpened="isOpened"
		@close="() => notesStore.closeNoteEditor()"
		:hasPadding="false"
		:displayTitle="false"
		title="Edit note"
		forceMobileFullHeight>

		<NoteEditor 
			displayInModal
			:note="editNote" 
		/>
	</Modal>
</template>

<script setup>
	import { computed } from 'vue'
	import { notesStore } from '@/store'
	import { NoteEditor } from '@/components/layouts'
	import { Modal } from '@/components/ui'

	const editNote = computed(() => {
		return notesStore.noteFindById({ noteId: notesStore.state.editNoteId })
	})

	const isOpened = computed(() => notesStore.state.editNoteModalVisible)
</script>