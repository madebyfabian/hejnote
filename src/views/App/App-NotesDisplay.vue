<template>
  <NoteList :notes="notes" title="All Notes" />
</template>

<script setup>
  import { computed } from 'vue'
	import { notesStore } from '@/store'
	
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import NoteList from '@/components/NoteList.vue'

	const collection = useCurrentCollection()

	const notes = computed(() => {
		return notesStore.notesFilterByCollection({ collectionId: collection.value?.id || null })
	})
</script>