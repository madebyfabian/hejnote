<template>
	<TextInput 
		v-if="isMobileDevice"
		v-model="searchNotesString" 
		:inputProps="{ placeholder: 'Search for something', required: true, spellcheck: false }" 
		class="mb-8">

		<template #icon>
			<IconSearch />
		</template>
	</TextInput>

	<NoteList :notes="notes" groupAllNotes :title="title">
		<template #empty-state>
			{{ searchNotesString.length && !notes.length ? 'Nothing found for this search.' : 'Start typing to see results...' }}
		</template>
	</NoteList>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import Fuse from 'fuse.js'
	import { notesStore } from '@/store'
	import { useRoute, useRouter } from 'vue-router'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'

  import NoteList from '@/components/NoteList.vue'
	import { TextInput } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'

	const route = useRoute(),
				router = useRouter()
	const isMobileDevice = useIsMobileDevice()

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

	const searchNotesString = computed({
		get() 			{ return route.query?.q || '' },
		set(newVal)	{ router.push({ query: { q: newVal } }) }
	})

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