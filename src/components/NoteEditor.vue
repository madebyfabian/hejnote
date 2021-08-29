<template>
	<article>
		<form @submit.prevent="shouldHandleFormSaveOnNextChange = true">
			<input 
				v-model="note.title" type="text" placeholder="New note" 
				class="p-6 pr-20 pb-2 text-150 text-gray-300 font-semibold bg-transparent w-full placeholder-gray-500 outline-none"
			/>

			<RichtextEditor v-model="note.content" />

			<div class="flex justify-end p-4 pt-0">
				<Button type="submit">Save</Button>
			</div>
		</form>
	</article>
</template>

<script setup>
	import { ref, reactive, watch, onUnmounted, nextTick } from 'vue'
	import { debounce } from 'vue-debounce'
	import { store } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import Button from '@/components/Button.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'

	const emit = defineEmits(['isFinished'])

	const props = defineProps({
		note: { type: [ Object ], default: {} }
	})

	const note = reactive({
		id: 				props.note?.id || null,
		title: 			props.note?.title || '',
		content: 		props.note?.content || noteEditorContentDefault,
		is_pinned: 	props.note?.is_pinned || false,
		is_hidden: 	props.note?.is_hidden || false,
	})

	const shouldHandleFormSaveOnNextChange = ref(false)

	const _handleDataChange = async () => {
		if (note.id) {
			// When existing note data is being updated
			store.notesUpdateSingle({ noteId: note.id, newVal: note, updateState: false })
		} else {
			// When note is being freshly created right at this moment
			const noteData = await store.notesInsertSingle({ newVal: note, updateState: false })
			note.id = noteData.id
		}

		if (shouldHandleFormSaveOnNextChange.value) 
			handleFormSave()
	}

	// Watch for form data changes
	watch(
		[ note, shouldHandleFormSaveOnNextChange ], 
		debounce(_handleDataChange, 300),
		{ deep: true }
	)

	const handleFormSave = async () => {
		shouldHandleFormSaveOnNextChange.value = false

		// Fetch the final row and add it to store
		try {
			await store.notesFetchSingle({ noteId: note.id, updateState: true })

			// Close the modal
			emit('isFinished')

		} catch (error) {
			console.error('error caused by notesFetchSingle', error)
		}
	}

	onUnmounted(() => {
		store.state.editNoteId = null
	})
</script>