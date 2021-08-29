<template>
	<section class="grid -m-3 relative">
		<Note :note="note" dragHandlerClass="item-dragHandler" />
	</section>
</template>

<script setup>
	import Note from '@/components/Note.vue'

	const props = defineProps({
		notes: 				{ type: Array, required: true },
		showIsPinned: { type: Boolean, default: false },
	})
</script>