<template>
	<article class="Note" @click="handleNoteEdit">
		<div class="select-none">
			<h3 v-if="note.title" v-text="note.title" @click="handleNoteEdit" class="mb-3" />
			<RichtextEditor v-model="props.note.content" isReadonly />
		</div>
		
		<div class="flex justify-end mt-3 -mb-2 -mr-2" >
			<div ref="noteActionBarEl">
				<NoteActionBar :note="note" />
			</div>
		</div>
	</article>
</template>

<script setup>
	import { nextTick, ref } from 'vue'
	import { store } from '@/store'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import Button from '@/components/Button.vue'
	
	const props = defineProps({
		note: { required: true },
	})
	
	const noteActionBarEl = ref(null)

	const handleNoteEdit = e => {
		// If user clicked icon on the action bar, don't fire the edit stuff.
		if (e.path.includes(noteActionBarEl?.value))
			return 

		store.state.editNoteId = props.note.id
		nextTick(() => {
			store.state.editNoteModalVisible = true
		})
	}
</script>

<style lang="postcss" scoped>
	.Note {
		@apply bg-gray-800 rounded-2xl p-4 cursor-default transition duration-150 mb-6;
	}
</style>