<template>
	<article @click="handleNoteEdit" tabindex="0" class="Note group" :aria-label="noteTitleLabel">
	
		<h3 v-if="note.title" v-text="note.title" @click="handleNoteEdit" class="mb-3" />
		<RichtextEditor v-if="!noteContentIsEmpty" v-model="note.content" isReadonly class="mb-3" />
	
		<div class="
			w-fit ml-auto -mb-2 -mr-2
			transition opacity-0 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
			ref="noteActionBarEl">
	
			<NoteActionBar :note="note" />
		</div>
	</article>
</template>

<script setup>
	import { computed, nextTick, ref, watch } from 'vue'
	import { store } from '@/store'
	import { noteEditorContentDefault } from '@/utils/constants'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import Button from '@/components/Button.vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	
	const props = defineProps({
		note: { required: true },
	})

	const noteContentIsEmpty = computed(() => JSON.stringify(noteEditorContentDefault) === JSON.stringify(props.note.content))
	const noteTitleLabel = computed(() => `Note with title "${ props.note.title }"`)
	const noteActionBarEl = ref(null)

	const handleNoteEdit = e => {
		const clickedActionBar = e.path.includes(noteActionBarEl?.value),
					selectedSomething = window.getSelection().type === 'Range',
					clickedLink = e.target.tagName === 'A'

		if (clickedActionBar || selectedSomething || clickedLink)
			return 

		store.state.editNoteId = props.note.id
		nextTick(() => {
			store.state.editNoteModalVisible = true
		})
	}
</script>

<style lang="postcss" scoped>
	.Note {
		@apply bg-gray-800 rounded-2xl p-4 cursor-default transition duration-150 mb-6;
	}
</style>