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
	import { ref, computed, onMounted } from 'vue'
	import Fuse from 'fuse.js'
	import { notesStore, linksStore, joinNotesLinksStore } from '@/store'
	import { useRoute, useRouter } from 'vue-router'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'
	import richtextEditorUtils from '@/utils/richtextEditorUtils'

  import { NoteList } from '@/components/layouts'
	import { TextInput } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'

	const route = useRoute(),
				router = useRouter()
	const isMobileDevice = useIsMobileDevice()

	const notesOriginalData = computed(() => notesStore.getNotes())
	const searchNotesString = computed({
		get() 			{ return route.query?.q || '' },
		set(newVal)	{ router.push({ query: { q: newVal } }) }
	})
	const title = computed(() => {
		return `Search Results ${ searchNotesString.value.length ? `for \"${ searchNotesString.value }\"` : '' }`
	})

	const getNotesTransformedData = async () => {
		return await Promise.all(notesOriginalData.value.map(async item => {
			const content = await richtextEditorUtils.generateText({ doc: item.content })

			const links = linksStore._findLinksByNoteIdsV2({ noteIds: [ item.id ] })
			const joinNotesLinks = joinNotesLinksStore.findJoinNotesLinksByNoteIds({ noteIds: [ item.id ] })

			return {
				...item,
				content,

				// Custom fields, only for search index
				_links: links,
				_joinNotesLinks: joinNotesLinks
			}
		}))
	}


	// Setup fuse.js
	let fuse 
	const fuseInited = ref(false)
	onMounted(async () => {
		const searchData = await getNotesTransformedData()

		fuse = new Fuse(searchData, { keys: [
			{ name: 'title', weight: 1 },
			{ name: 'id', weight: 1 },
			{ name: 'content', weight: 1 },

			// Custom fields, only for search index
			{ name: '_links.id', weight: 0.8 },
			{ name: '_links.title', weight: 0.8 },
			{ name: '_links.url', weight: 0.8 },
			{ name: '_joinNotesLinks.annotation', weight: 0.8 },
		] })

		fuseInited.value = true
	})

	const notes = computed(() => {
		if (!fuseInited.value) 
			return []

		let results = fuse.search(searchNotesString.value)

		// Map the original data to the results, so that the notes can be rendered properly.
		results = results.map(result => notesOriginalData.value.find(item => item.id === result.item.id))
		
		return results
	})
</script>