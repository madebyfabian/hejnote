<template>
	<article 
		@click="handleNoteEdit"
		@keypress.enter="handleNoteEdit"
		:aria-label="noteTitleLabel"
		:class="{ isNoteBeingEdited }"
		tabindex="0" 
		class="Note group ring-0">
		
		<h3 v-if="note.title" v-text="note.title" @click="handleNoteEdit" class="mb-2" />
		<div class="relative max-h-80 overflow-hidden">
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
				class="pointer-events-none absolute left-0 bottom-0 z-10 w-full h-10 bg-gradient-to-t from-gray-800"
				:class="{ 'opacity-0 invisible': !richtextEditorIsTruncated }"
			/>
		</div>

		<div 
			ref="noteActionBarEl" 
			class="-m-2 mt-0 flex items-center" 
			:class="collection ? 'justify-between' : 'justify-end'">
			
			<Note-CollectionBadge :note="note" />

			<div class="transition opacity-0 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
				<Note-ActionBar :note="note" />
			</div>
		</div>

		<div v-if="noteLinks.length" ref="noteLinkListEl" class="mt-4 -m-2">
			<Note-LinkList :noteId="note.id" />
		</div>
	</article>
</template>

<script setup>
	import { computed, onBeforeUnmount, ref, watch } from 'vue'
	import { linksStore, notesStore, collectionsStore } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import { Button, RichtextEditor } from '@/components/ui'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import NoteLinkList from '@/components/Note-LinkList.vue'
	import NoteCollectionBadge from '@/components/Note-CollectionBadge.vue'
	
	const props = defineProps({
		note: { required: true },
	})

	const noteContentIsEmpty = computed(() => JSON.stringify(noteEditorContentDefault) === JSON.stringify(props.note.content))
	const noteTitleLabel = computed(() => `Edit note "${ props.note.title }"`)
	const noteLinks = computed(() => linksStore._findLinksByNoteId({ noteId: props.note.id }))
	const isNoteBeingEdited = computed(() => notesStore.state.editNoteId === props.note.id)
	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const noteActionBarEl = ref(null),
				noteLinkListEl = ref(null),
				richtextEditorWrapEl = ref(null),
				richtextEditorIsTruncated = ref(false),
				_richtextEditorHeightObserver = ref(undefined)

	const handleNoteEdit = e => {
		const clickedActionBar = e.composedPath().includes(noteActionBarEl?.value),
					clickedLinkListEl = e.composedPath().includes(noteLinkListEl?.value),
					selectedSomething = window.getSelection().type === 'Range',
					clickedLink = e.target.tagName === 'A'

		if (clickedActionBar || clickedLinkListEl || selectedSomething || clickedLink)
			return 

		notesStore.openNoteEditor({ editNoteId: props.note.id })
	}

	// Create richtext height observer
	const createRichtextEditorHeightObserver = () => {
		const target = richtextEditorWrapEl?.value
		_richtextEditorHeightObserver.value = new ResizeObserver(() => {
			richtextEditorIsTruncated.value = richtextEditorWrapEl?.value.clientHeight > 400
		})
		_richtextEditorHeightObserver.value.observe(target)
	}

	// Destroy observer
	onBeforeUnmount(() => {
		_richtextEditorHeightObserver.value?.disconnect()
	})
</script>

<style lang="postcss" scoped>
	.Note {
		@apply bg-gray-800 rounded-2xl p-4 cursor-default transition duration-225 mb-6;

		&.isNoteBeingEdited {
			@apply blur-md;
		}
	}
</style>