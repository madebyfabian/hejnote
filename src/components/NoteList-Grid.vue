<template>
	<section class="NoteList-Grid">
		<masonry v-bind="masonryOptions">
			<Note 
				v-for="note of notes"
				:key="note.id" 
				:note="note"
			/>
		</masonry>
	</section>
</template>

<script setup>
	import Note from '@/components/Note.vue'

	const props = defineProps({
		notes: 				{ type: Array, required: true },
		showIsPinned: { type: Boolean, default: false },
	})

	const masonryOptions = {
		cols: {
			default: 3,
			1064: 2,
			768: 1,
		},
		gutter: 24,
	}
</script>