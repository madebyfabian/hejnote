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
	import { Note } from '@/components'

	const props = defineProps({
		notes: 				{ type: Array, required: true },
		showIsPinned: { type: Boolean, default: false },
	})

	const desktopWidth = 1064 - 2

	const masonryOptions = {
		cols: {
			default: 3,
			[ desktopWidth ]: 2,
			768: 1,
		},
		gutter: 24,
	}
</script>