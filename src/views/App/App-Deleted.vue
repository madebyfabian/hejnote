<template>
  <NoteList :notes="notes" groupAllNotes title="Trash" />
</template>

<script setup>
  import { computed } from 'vue'
  import { store } from '@/store'
  import NoteList from '@/components/NoteList.vue'

	const notes = computed(() => {
		return store.notesFilter({ showDeleted: true })
	})
</script>