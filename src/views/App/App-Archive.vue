<template>
  <NoteList :notes="notes" groupAllNotes title="Archive" />
</template>

<script setup>
  import { computed } from 'vue'
  import { notesStore } from '@/store'
  import { NoteList } from '@/components'

	const notes = computed(() => {
		return notesStore.notesFilterForArchive()
	})
</script>