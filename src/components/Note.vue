<template>
	<article 
		@click="handleNoteEdit"
		@keypress.enter="handleNoteEdit"
		:aria-label="noteTitleLabel"
		:class="{ isNoteBeingEdited }"
		tabindex="0" 
		class="Note group">
		
		<h3 v-if="note.title" v-text="note.title" @click="handleNoteEdit" class="mb-2" />
		<RichtextEditor v-if="!noteContentIsEmpty" v-model="note.content" isReadonly class="mb-2" />
	
		<div ref="noteActionBarEl" class="
			w-fit ml-auto -mb-2 -mr-2
			transition opacity-0 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
	
			<Note-ActionBar :note="note" />
		</div>

		<div v-if="noteLinks.length" ref="noteLinkListEl" class="mt-4 -m-2">
			<Note-LinkList :noteId="note.id" />
		</div>
	</article>
</template>

<script setup>
	import { computed, nextTick, ref, watch } from 'vue'
	import { linksStore, notesStore } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import Button from '@/components/Button.vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import NoteLinkList from '@/components/Note-LinkList.vue'
	
	const props = defineProps({
		note: { required: true },
	})

	const noteContentIsEmpty = computed(() => JSON.stringify(noteEditorContentDefault) === JSON.stringify(props.note.content))
	const noteTitleLabel = computed(() => `Edit note "${ props.note.title }"`)
	const noteLinks = computed(() => linksStore._findLinksByNoteId({ noteId: props.note.id }))
	const isNoteBeingEdited = computed(() => notesStore.state.editNoteId === props.note.id)
	const noteActionBarEl = ref(null),
				noteLinkListEl = ref(null)

	const handleNoteEdit = e => {
		const clickedActionBar = e.composedPath().includes(noteActionBarEl?.value),
					clickedLinkListEl = e.composedPath().includes(noteLinkListEl?.value),
					selectedSomething = window.getSelection().type === 'Range',
					clickedLink = e.target.tagName === 'A'

		if (clickedActionBar || clickedLinkListEl || selectedSomething || clickedLink)
			return 

		notesStore.openNoteEditor({ editNoteId: props.note.id })
	}
</script>

<style lang="postcss" scoped>
	.Note {
		@apply bg-gray-800 rounded-2xl p-4 cursor-default transition duration-225 mb-6;

		&.isNoteBeingEdited {
			@apply blur-md;
		}
	}
</style>