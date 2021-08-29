<template>
	<section class="NoteList-Grid">
		<masonry :cols="3" :gutter="24">
			<Note 
				v-for="note of notes"
				:key="note.id" 
				:note="note"
				dragHandlerClass="item-dragHandler" 
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
</script>