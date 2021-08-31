<template>
	<div ref="NoteEditor" v-click-outside="handleClickOutside">
		<article 
			class="transition-transform duration-150" 
			:class="{ 'transform-gpu -translate-y-12 delay-100': displayMinimized }">

			<form @submit.prevent="shouldHandleFormSaveOnNextChange = true">
				<div class="transition-opacity duration-300 opacity-0" :class="{ 'opacity-100': !displayMinimized }">
					<input 
						v-model="note.title" type="text" placeholder="New note" 
						class="p-5 pr-20 pb-2 text-150 text-gray-300 font-semibold bg-transparent w-full placeholder-gray-500 outline-none"
					/>
				</div>

				<RichtextEditor 
					v-model="note.content" 
					@editorFocus="val => emit('editorFocus', val)"
					:key="richtextEditorKey"
				/>

				<div v-if="displayInModal" class="flex justify-end p-4 pt-0">
					<Button type="submit" buttonType="secondary">Create Note</Button>
				</div>

				<div v-if="noteLinks.length" class="m-2">
					<Note-LinkList :noteId="note.id" />
				</div>
			</form>
		</article>

		<div v-if="!displayInModal" class="h-14">
			<div 
				class="flex justify-end pt-0 p-3 opacity-0 transition transform-gpu" 
				:class="displayMinimized ? 'duration-300 opacity-0 -translate-y-3' : 'duration-500 opacity-100 -translate-y-0'">

				<Button buttonType="secondary">Close</Button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, watch, onUnmounted, computed } from 'vue'
	import { debounce } from 'vue-debounce'
	import { generalStore, linksStore, notesStore } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import Button from '@/components/Button.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import NoteLinkList from '@/components/Note-LinkList.vue'

	const emit = defineEmits([ 'isFinished', 'editorFocus' ])

	const props = defineProps({
		note: 						{ type: [ Object ], default: {} },
		displayMinimized: { type: Boolean, default: false },
		displayInModal: 	{ type: Boolean, default: false },	
	})
	
	const _note_defaults = {
		id: 				props.note?.id || null,
		title: 			props.note?.title || '',
		content: 		props.note?.content || noteEditorContentDefault,
		is_pinned: 	props.note?.is_pinned || false,
		is_hidden: 	props.note?.is_hidden || false,
	}

	const note = reactive({ ..._note_defaults })

	const lastLinkSet = reactive(new Set(
		linksStore._findLinksByNoteId({ noteId: note.id }).map(link => link.url)
	))

	const noteLinks = computed(() => linksStore._findLinksByNoteId({ noteId: props.noteId }))
	const shouldHandleFormSaveOnNextChange = ref(false)
	const richtextEditorKey = ref(0)

	const _handleDataChange = async () => {
		console.log('_handleDataChange', note);
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

		try {
			// Fetch the final row and add it to store
			if (note.id)
				await notesStore.notesFetchSingle({ noteId: note.id })

			// Close the modal
			emit('isFinished')

			// Reset note store
			Object.assign(note, _note_defaults)

			// Re-mount richtext editor component
			richtextEditorKey.value++

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
	
	const handleClickOutside = () => {
		if (!props.displayMinimized)
			handleFormSave()
	}

	onUnmounted(() => {
		generalStore.closeNoteEditor()
	})
</script>