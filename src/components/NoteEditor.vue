<template>
	<div class="NoteEditor z-50" v-click-outside="handleClickOutside">
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
				/>

				<div v-if="displayInModal" class="flex justify-end p-4 pt-0">
					<Button type="submit" buttonType="secondary">Save</Button>
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

				<Button buttonType="secondary" @click="handleClickOutside">Close</Button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, watch, onUnmounted, computed, watchEffect } from 'vue'
	import { debounce } from 'vue-debounce'
	import { generalStore, linksStore, notesStore } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import Button from '@/components/Button.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import NoteLinkList from '@/components/Note-LinkList.vue'

	console.log('mounted NoteEditor.vue')

	const emit = defineEmits([ 'isFinished', 'editorFocus' ])

	const props = defineProps({
		note: 						{ type: [ Object ], default: {} },
		displayMinimized: { type: Boolean, default: false },
		displayInModal: 	{ type: Boolean, default: false },	
	})

	// Setup note data
	const _note_defaults = {
		id: 				props.note?.id || null,
		title: 			props.note?.title || '',
		content: 		props.note?.content || noteEditorContentDefault,
		is_pinned: 	props.note?.is_pinned || false,
		is_hidden: 	props.note?.is_hidden || false,
	}
	const note = reactive({ ..._note_defaults })

	// Setup note links
	const noteLinks = computed(() => linksStore._findLinksByNoteId({ noteId: note.id }))
	const lastLinkSet = reactive(new Set(noteLinks.value.map(link => link.url)))
	
	// Other refs
	const shouldHandleFormSaveOnNextChange = ref(false)


	/** 
	 * Methods
	 */
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

		try {
			// Fetch the final row and add it to store
			if (note.id)
				await notesStore.notesFetchSingle({ noteId: note.id })

			emit('isFinished')

		} catch (error) {
			console.error('error caused by notesFetchSingle', error)
		}
	}

	const handleClickOutside = () => {
		if (!props.displayMinimized)
			handleFormSave()
	}

	const updateLinks = () => {
		// Search for links
		let links = buildSetOfLinks(note.content?.content)

		const newVal = [...links],
					oldVal = [...lastLinkSet]

		const urlsToAdd = newVal.filter(url => !oldVal.includes(url))
		if (urlsToAdd.length) {
			linksStore.linksInsert({ urlArray: urlsToAdd, noteId: note.id })
		}

		const urlsToDelete = oldVal.filter(url => !newVal.includes(url))
		if (urlsToDelete.length) {
			linksStore.linksDeleteV2({ urlArray: urlsToDelete, noteIds: [ note.id ] })
		}

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
		console.log('unmounted NoteEditor.vue');
		generalStore.closeNoteEditor()
	})
</script>