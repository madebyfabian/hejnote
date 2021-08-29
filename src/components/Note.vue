<template>
	<article class="Note" @click.self="handleNoteEdit">
		<div class="select-none">
			<div class="flex justify-end">
				<h3 v-if="note.title" v-text="note.title" class="mb-3 flex-1" @click="handleNoteEdit" />
				<div class="-mr-2 -mt-2">
					<Button isIconOnly buttonType="secondary" hideBorder :class="dragHandlerClass">
						<IconDrag />
					</Button>
				</div>
			</div>
			<RichtextEditor v-model="props.note.content" isReadonly />
		</div>
		
		<div class="flex justify-end mt-3 -mb-2 -mr-2">
			<NoteActionBar :note="note" />
		</div>
	</article>
</template>

<script setup>
	import { nextTick } from 'vue'
	import { store } from '@/store'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import Button from '@/components/Button.vue'
	import { IconDrag } from '@/components/icons'
	
	const props = defineProps({
		note: 						{ required: true },
		dragHandlerClass: { type: String, default: 'dragHandler' },
		isBeingDragged: 	{ type: Boolean, default: false },
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
		@apply bg-gray-800 rounded-2xl p-4 cursor-default transition duration-150;
	}
</style>