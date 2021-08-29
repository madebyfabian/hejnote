<template>
	<section class="grid gap-6 grid-cols-3">
		<Note 
			v-for="note of notes"
			:key="note.id" 
			:note="note"
			dragHandlerClass="item-dragHandler" 
		/>
	</section>
</template>

<script setup>
	import Note from '@/components/Note.vue'

	const props = defineProps({
		notes: 				{ type: Array, required: true },
		showIsPinned: { type: Boolean, default: false },
	})
</script>