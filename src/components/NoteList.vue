<template>
	<div class="NoteList">
		<div class="NoteList-heading">
			<h1 v-text="title" />
			<Badge v-if="isHiddenMode || collection?.id">
				{{ isHiddenMode ? 'Hidden' : null }}
				{{ collection?.id ? 'Collection' : null }}
			</Badge>
		</div>

		<template v-if="pinnedNotes.length || otherNotes.length">
			<section v-if="pinnedNotes.length">
				<h2 class="NoteList-sectionTitle">Pinned</h2>
				<div class="NoteList-sectionGrid">
					<Note 
						v-for="note of pinnedNotes" :key="note.id" 
						:note="note"
					/>
				</div>
			</section>

			<section v-if="otherNotes.length">
				<h2 v-if="pinnedNotes.length" class="NoteList-sectionTitle">Others</h2>
				<div class="NoteList-sectionGrid">
					<Note 
						v-for="note of otherNotes" :key="note.id" 
						:note="note"
					/>
				</div>
			</section>
		</template>	

		<p v-else class="NoteList-emptyState">There are no notes yet.</p>
	</div>
</template>

<script setup>
	import { computed, watchEffect, ref } from 'vue'
	import { store } from '@/store'
	import useDayjs from '@/hooks/useDayjs'
	import useIsHiddenMode from '@/hooks/useIsHiddenMode'
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import Note from '@/components/Note.vue'
	import Badge from '@/components/Badge.vue'
	
	const dayjs = useDayjs()

	const props = defineProps({
		notes: 					{ required: true },
		groupAllNotes: 	{ type: Boolean, default: false },
		title: 					{ type: String, default: 'Notes' },
	})

	const pinnedNotes = ref([]),
        otherNotes = ref([])

	const notesSortGiven = ( notes ) => {
    return (notes || []).sort(( a, b ) => {
      return dayjs(b.updated_at).valueOf() 
           - dayjs(a.updated_at).valueOf()
    })
  }

	const isHiddenMode = useIsHiddenMode(),
				collection = useCurrentCollection()

  watchEffect(() => {
    if (!props.notes)
      return

		const notes = notesSortGiven(props.notes)

    pinnedNotes.value = notes.filter(note => note != undefined && (props.groupAllNotes ? false : note.is_pinned))
    otherNotes.value = notes.filter(note => note != undefined && (props.groupAllNotes ? true : !note.is_pinned))
  })
</script>

<style lang="postcss" scoped>
	.NoteList {
		@apply px-4;

		&-heading {
			@apply flex items-center mx-4 mb-8;

			:deep(h1) {
				@apply mr-3;
			}
		}

		&-sectionTitle {
			@apply m-4 mt-8;
		}

		&-sectionGrid {
			@apply grid grid-cols-1 desktop:grid-cols-3 gap-6 items-start;
		}

		&-emptyState {
			@apply text-gray-500 text-150 select-none mx-4;
		}
	}
</style>