<template>
  <NoteList :notes="notes" title="Notes">
		<template v-if="!collectionId" #empty-state>
			There are no notes which aren't inside a collection.
		</template>
	</NoteList>
</template>

<script setup>
  import { computed } from 'vue'
	import { notesStore } from '@/store'
	import { useRoute } from 'vue-router'

	const route = useRoute()
	const routeName = computed(() => route.name)
	
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import NoteList from '@/components/NoteList.vue'

	const collection = useCurrentCollection(),
				collectionId = computed(() => collection.value?.id)

	const notes = computed(() => {
		if (!collectionId.value)
			return notesStore.notesFilterOnlyWithoutCollection()
		else
			return notesStore.notesFilterByCollection({ collectionId: collectionId.value })
	})
</script>