<template>
	<div class="Note-ActionBar flex items-center gap-1" role="toolbar">
		<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteHideAction">
			<IconEyeOff v-if="!note.is_hidden" />
			<IconEyeOffSolid v-else />
		</Button>

		<Button v-if="!note.deleted_at" isIconOnly buttonType="secondary" hideBorder @click="handleNotePinAction">
			<IconPin v-if="!note.is_pinned" />
			<IconPinSolid v-else />
		</Button>

		<Button v-if="!note.deleted_at" isIconOnly buttonType="secondary" hideBorder @click="handleNoteMoveToDeleted">
			<IconTrash />
		</Button>

	  <template v-else>
			<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteMoveOutOfDeleted">
				<IconTrashUndo />
			</Button>

			<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteFullyDelete">
				<IconTrashDelete />
			</Button>
		</template>
	</div>
</template>

<script setup>
	import Button from '@/components/Button.vue'
	import { IconEyeOff, IconEyeOffSolid, IconPin, IconPinSolid, IconTrash, IconTrashDelete, IconTrashUndo } from '@/components/icons'
	import { nextTick } from 'vue'
	import useConfirm from '@/hooks/useConfirm'
	import { store } from '@/store'
	import useSupabase from '@/hooks/useSupabase'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	
	const supabase = useSupabase()

	const props = defineProps({
		note: { required: true }
	})

	const handleNotePinAction = () => {
		store.notesUpdateSingle({ noteId: props.note.id, newVal: { is_pinned: !props.note.is_pinned } })
	}

	const handleNoteHideAction = async () => {
		const answer = await useConfirm().doConfirm({ 
			title: `${ props.note.is_hidden ? 'Make this note visible again' : 'Hide this note' }?`,
			question: 'You can always undo this at anytime.' 
		})

		if (answer == true)
			store.notesUpdateSingle({ noteId: props.note.id, newVal: { is_hidden: !props.note.is_hidden } })
	}

	const handleNoteMoveToDeleted = () => {
		store.notesUpdateSingleDeletedState({ noteId: props.note.id, deleted_at: new Date() })
	}

	const handleNoteMoveOutOfDeleted = () => {
		store.notesUpdateSingleDeletedState({ noteId: props.note.id, deleted_at: null })
	}

	const handleNoteFullyDelete = async () => {
		const answer = await useConfirm().doConfirm({ 
			title: 'Delete this note permanently?',
			question: 'Do you want to delete this note permanently?<br>You can\'t undo this.' 
		})

		if (answer == true) 
			store.notesDeleteSingle({ noteId: props.note.id })
	}
</script>