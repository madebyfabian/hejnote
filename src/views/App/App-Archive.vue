<template>
  <NoteList :notes="notes" groupAllNotes title="Archive" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { notesStore } from '@/store'
  import { NoteList } from '@/components/layouts'

	const notes = computed(() => {
		return notesStore.notesFilterForArchive()
	})
</script>