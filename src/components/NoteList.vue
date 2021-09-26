<template>
	<div class="NoteList">
		<div class="NoteList-heading">
			<div class="flex items-center">
				<h1 v-text="title" />
				<Badge v-if="isHiddenMode || collection?.id">
					{{ isHiddenMode ? 'Hidden' : null }}
					{{ collection?.id ? 'Collection' : null }}
				</Badge>
				<slot name="heading-left" />
			</div>

			<div>
				<slot name="heading-right" />
			</div>
		</div>

		<template v-if="pinnedNotes.length || otherNotes.length">
			<section v-if="pinnedNotes.length">
				<h2 class="NoteList-sectionTitle">Pinned</h2>
				<NoteList-Grid :notes="pinnedNotes" />
			</section>

			<section v-if="otherNotes.length">
				<h2 v-if="pinnedNotes.length" class="NoteList-sectionTitle">Others</h2>
				<NoteList-Grid :notes="otherNotes" />
			</section>
		</template>	

		<p v-else class="NoteList-emptyState">
			<slot name="empty-state">
				There are no notes yet.
			</slot>
		</p>
	</div>
</template>

<script setup>
	import { computed, watchEffect, ref } from 'vue'
	import useDayjs from '@/hooks/useDayjs'
	import { generalStore } from '@/store'
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import { Badge } from '@/components/ui'
	import NoteListGrid from '@/components/NoteList-Grid.vue'
	
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
      return dayjs(b.created_at).valueOf() 
           - dayjs(a.created_at).valueOf()
    })
  }

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode),
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
		&-heading {
			@apply flex items-center justify-between mb-8;

			:deep(h1) {
				@apply mr-3;
			}
		}

		&-sectionTitle {
			@apply my-4 mt-8;
		}

		&-emptyState {
			@apply text-gray-500 select-none -mt-5;
		}
	}
</style>