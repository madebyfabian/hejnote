<template>
	<Modal 
		:isOpened="isOpened"
		@close="handleClose"
		:hasPadding="false"
		:displayTitle="false"
		:title="title"
		forceMobileFullHeight>

		<NoteEditor 
			displayInModal
			:startWithNewLink="startWithNewLink"
			:note="editNote" 
		/>
	</Modal>
</template>

<script setup>
	import { computed, watch } from 'vue'
	import { notesStore } from '@/store'
	import { NoteEditor } from '@/components/layouts'
	import { Modal } from '@/components/ui'

	const props = defineProps({
		/**
		 * Determines whether the editor should be in edit (update) mode or in create mode.
		 */
		isCreateAction: { type: Boolean, default: false },
	})

	const editNote = computed(() => {
		return !props.isCreateAction 
			? notesStore.noteFindById({ noteId: notesStore.state.editNoteId })
			: undefined
	})

	const isOpened = computed(() => {
		return !props.isCreateAction
			? notesStore.state.editNoteModalVisible
			: notesStore.state.createNoteModalVisible
	})

	const title = computed(() => {
		return !props.isCreateAction
			? 'Edit note'
			: 'Create note'
	})

	const startWithNewLink = computed(() => notesStore.state.createNoteStartWithNewLink)

	const handleClose = () => {
		if (!props.isCreateAction) 
			notesStore.toggleNoteEditor({ isVisible: false })
		else 
			notesStore.toggleCreateNoteModal({ isVisible: false })
	}
</script>