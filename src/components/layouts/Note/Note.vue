<template>
	<article 
		@click="handleNoteEdit"
		@keypress.enter="handleNoteEdit"
		@focusin="handleFocusIn"
		@focusout="handleFocusOut"
		@mouseenter="handleFocusIn"
		@mouseleave="handleFocusOut"
		:aria-label="noteTitleLabel"
		class="
			Note relative rounded-2xl cursor-default transition duration-225 overflow-hidden
			border border-gray-800 
			p-4 mb-4 desktop:mb-6
			flex flex-col gap-4
		"
		:class="[
			isNoteBeingEdited ? 'blur-md': '',
			noteContentIsEmpty ? 'bg-gray-1000': 'bg-gray-900',
		]"
		tabindex="0" 
		ref="noteEl">

		<!-- Content -->
		<div 
			v-if="note.title || !noteContentIsEmpty" 
			class="flex flex-col gap-2 z-10">
			
			<h3 v-if="note.title" @click="handleNoteEdit" v-text="note.title" />

			<div v-if="!noteContentIsEmpty" class="Note-contentWrap">
				<Note-Content :noteContent="note.content" />
			</div>
		</div>

		<!-- ActionBar -->
		<Note-ActionBar
			:note="note" 
			:displayButtons="displayActionBar"
			@changedOpenState="newVal => actionBarContextMenuOpened = newVal" 
			class="z-10"
			:class="noteContentIsEmpty ? 'order-3' : 'order-2'"
		/>

		<!-- LinkList -->
		<div 
			v-if="noteLinks.length" 
			:class="noteContentIsEmpty ? 'order-2 -my-4 desktop:-my-3' : 'order-3 -mb-4'"
			class="-mx-4 relative">

			<span v-if="!noteContentIsEmpty" aria-hidden="true" class="h-4 w-full absolute left-0 -top-4 bg-gray-1000 pointer-events-none">
				<span class="h-full w-full block bg-gray-900 rounded-b-2xl"></span>
			</span>

			<Note-LinkList 
				:noteId="note.id" 
				:displayAsLinkOnly="true"
				isReadonly 
			/>
		</div>		
	</article>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { linksStore, notesStore } from '@/store'
	import { Button } from '@/components/ui'
	import { NoteActionBar, NoteLinkList, NoteContent } from '@/components/layouts'
	
	const props = defineProps({
		note: { required: true },
	})

	const noteContentIsEmpty = computed(() => notesStore.isNoteContentEmpty({ noteContent: props.note?.content }))
	const noteTitleLabel = computed(() => `Edit note "${ props.note.title }"`)
	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ props.note.id ] }))
	const isNoteBeingEdited = computed(() => notesStore.state.editNoteId === props.note.id)

	const noteEl = ref(null)

	const	actionBarContextMenuOpened = ref(false),
				displayActionBar = ref(false)
				
	const handleNoteEdit = e => {
		const selectedSomething = window.getSelection().type === 'Range',
					clickedLink = e.target.tagName === 'A'

		if (selectedSomething || clickedLink)
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

		--max-height: 10rem;
		max-height: var(--max-height);

		@screen desktop {
			--max-height: 15rem;
		}

		--gradient: linear-gradient(to bottom, black calc(var(--max-height) - 2.5rem), transparent var(--max-height));
		-webkit-mask-image: var(--gradient);
		mask-image: var(--gradient);
	}
</style>