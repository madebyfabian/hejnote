<template>
  <NoteList :notes="notes" groupAllNotes title="Trash" />
</template>

<script setup>
  import { computed } from 'vue'
  import { notesStore } from '@/store/notesStore'
  import NoteList from '@/components/NoteList.vue'

	const notes = computed(() => {
		return notesStore.notesFilter({ showDeleted: true })
	})
</script>