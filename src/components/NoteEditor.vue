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

			<div class="m-2">
				<Note-LinkList :noteId="note.id" />
			</div>
		</form>
	</article>
</template>

<script setup>
	import { ref, reactive, watch, onUnmounted, nextTick, computed } from 'vue'
	import { debounce } from 'vue-debounce'
	import { linksStore } from '@/store/linksStore'
	import { notesStore } from '@/store/notesStore'
	import { generalStore } from '@/store/generalStore'
	import { noteEditorContentDefault } from '@/utils/constants'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import Button from '@/components/Button.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import NoteLinkList from '@/components/Note-LinkList.vue'

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

	const lastLinkSet = reactive(new Set(
		linksStore._findLinksByNoteId({ noteId: note.id }).map(link => link.url)
	))

	const shouldHandleFormSaveOnNextChange = ref(false)

	const _handleDataChange = async () => {
		if (note.id) {
			// When existing note data is being updated
			notesStore.notesUpdateSingle({ noteId: note.id, newVal: note, updateState: false })
		} else {
			// When note is being freshly created right at this moment
			const noteData = await notesStore.notesInsertSingle({ newVal: note, updateState: false })
			note.id = noteData.id
		}

		updateLinks()

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
			await notesStore.notesFetchSingle({ noteId: note.id })

			// Close the modal
			emit('isFinished')

		} catch (error) {
			console.error('error caused by notesFetchSingle', error)
		}
	}

	const updateLinks = () => {
		// Search for links
		let links = buildSetOfLinks(note.content?.content)

		const newVal = [...links],
					oldVal = [...lastLinkSet]

		const linksToAdd = newVal.filter(link => !oldVal.includes(link))
		if (linksToAdd.length) 
			linksStore.linksInsert({ urlArray: linksToAdd, noteId: note.id })

		const linksToDelete = oldVal.filter(link => !newVal.includes(link))
		if (linksToDelete.length)
			linksStore.linksDelete({ urlArray: linksToDelete, noteId: note.id })

		lastLinkSet.clear()
		links.forEach(setValue => lastLinkSet.add(setValue))
	}

	const buildSetOfLinks = content => {
		let linkSet = new Set()
		for (const obj of content) {
			if (obj?.type === 'text') {
				const linkMark = obj?.marks?.find(mark => mark?.type === 'link')
				if (linkMark) 
					linkSet.add(linkMark.attrs.href)
			}

			if (obj?.content) 
				buildSetOfLinks(obj?.content).forEach(setValue => linkSet.add(setValue))
		}
		return linkSet
	}

	onUnmounted(() => {
		generalStore.closeNoteEditor()
	})
</script>