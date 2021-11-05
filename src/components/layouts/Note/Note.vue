<template>
	<article 
		@click="handleNoteEdit"
		@keypress.enter="handleNoteEdit"
		@focusin="handleFocusIn"
		@focusout="handleFocusOut"
		@mouseenter="handleFocusIn"
		@mouseleave="handleFocusOut"
		:aria-label="noteTitleLabel"
		class="Note relative border border-gray-700 border-opacity-50 rounded-2xl p-4 cursor-default transition duration-225 mb-6 desktop:mb-8 overflow-hidden"
		:class="{ 
			'blur-md': isNoteBeingEdited,
		}"
		tabindex="0" 
		ref="noteEl">
		
		<h3 
			v-if="note.title" 
			v-text="note.title" 
			@click="handleNoteEdit"
			class="mb-2"
		/>

		<div v-if="!noteContentIsEmpty" class="relative max-h-80 overflow-hidden">
			<div ref="richtextEditorWrapEl">
				<RichtextEditor 
					v-if="!noteContentIsEmpty" 
					v-model="note.content" 
					@editorCreated="createRichtextEditorHeightObserver"
					isReadonly 
					class="mb-2" 
				/>
			</div>
			<span 
				aria-hidden="true" 
				class="pointer-events-none absolute left-0 bottom-0 z-10 w-full h-10 bg-gradient-to-t from-gray-900"
				:class="{ 'opacity-0 invisible': !richtextEditorIsTruncated }"
			/>
		</div>

		<div 
			v-if="noteLinks.length" 
			ref="noteLinkListEl" 
			:class="isLinkOnlyMode ? '-mx-4 -mt-4 mb-2' : '-mx-1 mt-2 mb-2'">

			<Note-LinkList 
				:noteId="note.id" 
				:displayAsLinkOnly="isLinkOnlyMode"
				isReadonly 
			/>
		</div>

		<div ref="noteActionBarEl">
			<Note-ActionBar
				:note="note" 
				:displayButtons="displayActionBar"
				@changedOpenState="newVal => actionBarContextMenuOpened = newVal" 
			/>
		</div>		
	</article>
</template>

<script setup>
	import { computed, onBeforeUnmount, ref, watch } from 'vue'
	import { linksStore, notesStore, collectionsStore } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import { Button, RichtextEditor } from '@/components/ui'
	import { NoteActionBar, NoteLinkList } from '@/components/layouts'
	
	const props = defineProps({
		note: { required: true },
	})

	const noteContentIsEmpty = computed(() => JSON.stringify(noteEditorContentDefault) === JSON.stringify(props.note.content))
	const noteTitleLabel = computed(() => `Edit note "${ props.note.title }"`)
	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ props.note.id ] }))
	const isNoteBeingEdited = computed(() => notesStore.state.editNoteId === props.note.id)
	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const isLinkOnlyMode = computed(() => !!(!props.note?.title?.length && noteContentIsEmpty.value && noteLinks.value?.length))
	const noteActionBarEl = ref(null),
				noteLinkListEl = ref(null),
				richtextEditorWrapEl = ref(null),
				richtextEditorIsTruncated = ref(false),
				_richtextEditorHeightObserver = ref(undefined),
				actionBarContextMenuOpened = ref(false),
				displayActionBar = ref(false),
				noteEl = ref(null)

	const handleNoteEdit = e => {
		const clickedActionBar = e.composedPath().includes(noteActionBarEl?.value),
					selectedSomething = window.getSelection().type === 'Range',
					clickedLink = e.target.tagName === 'A'

		if (clickedActionBar || selectedSomething || clickedLink)
			return 

		notesStore.toggleNoteEditor({ editNoteId: props.note.id, isVisible: true })
	}

	const handleFocusIn = () => {
		if (displayActionBar.value === true)
			return

		displayActionBar.value = true
	}

	const handleFocusOut = (event) => {
		const noteStillFocused = noteEl.value?.contains(event.relatedTarget)
		if (!noteStillFocused && !actionBarContextMenuOpened.value)
			displayActionBar.value = false
	}

	// Create richtext height observer
	const createRichtextEditorHeightObserver = () => {
		const target = richtextEditorWrapEl?.value
		_richtextEditorHeightObserver.value = new ResizeObserver(() => {
			richtextEditorIsTruncated.value = richtextEditorWrapEl?.value?.clientHeight > 400
		})
		_richtextEditorHeightObserver.value.observe(target)
	}

	// Destroy observer
	onBeforeUnmount(() => {
		_richtextEditorHeightObserver.value?.disconnect()
	})
</script>