<template>
  <NoteList :notes="notes" title="All Notes" />
</template>

<script setup>
  import { computed } from 'vue'
  import { store } from '@/store'
	
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import NoteList from '@/components/NoteList.vue'

	const collection = useCurrentCollection()

	const notes = computed(() => {
		return store.notesFilter({ collectionId: collection.value?.id || null })
	})
</script>