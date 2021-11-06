<template>
	<article 
		@click="handleNoteEdit"
		@keypress.enter="handleNoteEdit"
		@focusin="handleFocusIn"
		@focusout="handleFocusOut"
		@mouseenter="handleFocusIn"
		@mouseleave="handleFocusOut"
		:aria-label="noteTitleLabel"
		class="Note relative bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-default transition duration-225 mb-4 desktop:mb-6 overflow-hidden"
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

		<div v-if="!noteContentIsEmpty" class="Note-contentWrap">
			<Note-Content :noteContent="note.content" />
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
	import { Button } from '@/components/ui'
	import { NoteActionBar, NoteLinkList, NoteContent } from '@/components/layouts'
	
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
</script>

<style lang="postcss" scoped>
	.Note-contentWrap {
		@apply relative overflow-hidden;

		--max-height: 15rem;
		max-height: var(--max-height);

		--gradient: linear-gradient(to bottom, black calc(var(--max-height) - 2.5rem), transparent var(--max-height));
		-webkit-mask-image: var(--gradient);
		mask-image: var(--gradient);
	}
</style>