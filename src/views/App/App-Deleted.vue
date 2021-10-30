<template>
  <NoteList :notes="notes" groupAllNotes title="Trash">
    <template #heading-right>
      <Button v-if="notes.length" buttonType="tertiary" @click="handleDeleteAllNotesInTrash" hasNegativeMargin>Delete All</Button>
    </template>
  </NoteList>
</template>

<script setup>
  import { computed } from 'vue'
  import { notesStore } from '@/store'
  import useConfirm from '@/hooks/useConfirm'
  import { NoteList } from '@/components/layouts'
  import { Button } from '@/components/ui'

	const notes = computed(() => {
		return notesStore.notesFilterForTrash()
	})

  const handleDeleteAllNotesInTrash = async () => {
    const is1Note = notes.value.length === 1

    const answer = await useConfirm().doConfirm({ 
			title: is1Note ? `Delete 1 note permanently?` : `Delete all ${ notes.value.length } notes permanently?`,
			question: `Be aware! This will delete ${ is1Note ? 'the note' : 'all notes' } that ${ is1Note ? 'is' : 'are' } currently in trash. This action is not reversible.`
		})

		if (answer == true) {
      const noteIds = notes.value?.map(note => note.id)
      notesStore.notesDeleteV2({ noteIds })
    }
  }
</script>