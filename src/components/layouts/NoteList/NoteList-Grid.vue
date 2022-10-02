<template>
	<section class="NoteList-Grid">
		<Note 
			v-for="note of notes"
			:key="note.id" 
			:note="note"
		/>
	</section>
</template>

<script setup>
	import { Note } from '@/components/layouts'

	const props = defineProps({
		notes: 				{ type: Array, required: true },
		showIsPinned: { type: Boolean, default: false },
	})
</script>

<style lang="postcss" scoped>
	.NoteList-Grid {
		@apply grid grid-cols-1 desktop:grid-cols-3 gap-x-6 items-start;
	}
</style>