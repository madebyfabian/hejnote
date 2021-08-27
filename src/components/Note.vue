<template>
	<article class="Note" @click.self="handleNoteEdit">
		<div @click="handleNoteEdit" class="select-none">
			<h3 v-if="note.title" v-text="note.title" class="mb-3" />
			<RichtextEditor v-model="props.note.content" isReadonly />
		</div>
		
		<div class="flex justify-end mt-3 -mb-1 -mr-1">
			<NoteActionBar :note="note" />
		</div>
	</article>
</template>

<script setup>
	import { nextTick } from 'vue'
	import { store } from '@/store'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	
	const props = defineProps({
		note: { required: true }
	})

	const handleNoteEdit = () => {
		store.state.editNoteId = props.note.id
		nextTick(() => {
			store.state.editNoteModalVisible = true
		})
	}
</script>

<style lang="postcss" scoped>
	.Note {
		@apply bg-gray-800 rounded-2xl p-4 cursor-default;
	}
</style>