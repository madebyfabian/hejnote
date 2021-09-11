<template>
	<NoteList :notes="notes" groupAllNotes :title="title">
		<template #empty-state>
			{{ searchNotesString.length && !notes.length ? 'Nothing found for this search.' : 'Start typing to see results...' }}
		</template>
	</NoteList>
</template>

<script setup>
	import { computed } from 'vue'
	import Fuse from 'fuse.js'
	import { notesStore } from '@/store'
	import { useRoute } from 'vue-router'
  import NoteList from '@/components/NoteList.vue'

	const route = useRoute()

	/**
	 * Transform note.content json object into string or parse.
	 */
	const _contentTransform = ({ notes, stringify = true }) => {
		return notes.map(item => ({ 
			...item, 
			content: stringify ? JSON.stringify(item.content) : JSON.parse(item.content) 
		}))
	}

	const originalData = computed(() => {
		return _contentTransform({ notes: notesStore.getNotes(), stringify: true })
	})

	// Setup fuse.js
	const fuse = new Fuse(originalData.value, { keys: [
		{ name: 'title', weight: 1 },
		{ name: 'content', weight: 0.8 },
		{ name: 'id', weight: 1 }
	] })

	const searchNotesString = computed(() => route.query?.q || '')
	const title = computed(() => {
		return `Search Results ${ searchNotesString.value.length ? `for \"${ searchNotesString.value }\"` : '' }`
	})

	const notes = computed(() => {
		let results = fuse.search(searchNotesString.value)
		results = results.map(result => result.item)
		results = _contentTransform({ notes: results, stringify: false })
		return results
	})
</script>