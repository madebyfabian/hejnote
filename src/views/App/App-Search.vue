<template>
	<SearchNotesBar v-if="isMobileDevice" />

	<NoteList :notes="notes" groupAllNotes :title="title">
		<template #empty-state>
			{{ searchNotesString.length && !notes.length ? 'Nothing found for this search.' : 'Start typing to see results...' }}
		</template>
	</NoteList>
</template>

<script lang="ts" setup>
	import { ref, computed, onMounted } from 'vue'
	import Fuse from 'fuse.js'
	import { notesStore, linksStore, joinNotesLinksStore } from '@/store'
	import { useRoute } from 'vue-router'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'
	import richtextEditorUtils from '@/utils/richtextEditorUtils'

  import { NoteList, SearchNotesBar } from '@/components/layouts'

	const route = useRoute()

	const notesOriginalData = computed(() => notesStore.getNotes())
	const searchNotesString = computed(() => typeof route.query?.q === 'string' ? route.query?.q : null || '' )
	const isMobileDevice = useIsMobileDevice()
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
	let fuse: Fuse<any>
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