<template>
  <NoteList :notes="notes" title="All Notes" />
</template>

<script setup>
  import { computed } from 'vue'
	import { notesStore } from '@/store'
	import { useRoute } from 'vue-router'

	const route = useRoute()
	const routeName = computed(() => route.name)
	
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import NoteList from '@/components/NoteList.vue'

	const collection = useCurrentCollection()

	const notes = computed(() => {
		if (routeName.value === 'App-Uncategorized')
			return notesStore.notesFilterOnlyWithoutCollection()
		else
			return notesStore.notesFilterByCollection({ collectionId: collection.value?.id || null })
	})
</script>