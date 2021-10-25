<template>
	<div class="Note-ActionBar flex items-center gap-2 justify-end pt-2">
		<div class="flex items-center flex-1 -my-0.5">
			<Note-ActionBar-Collection v-bind="{ collection, isReadonly: isLocked }" @removeCollection="() => handleRemoveCollection()" />
		</div>

		<div 
			class="Note-ActionBar desktop:flex gap-5 transition-opacity" 
			:class="{ 
				'desktop:opacity-0': !displayButtons,
				'flex': isInEditMode,
				'hidden': !isInEditMode
			}"
			role="toolbar">

			<template v-if="!note.deleted_at">
				<!-- Lock: Inside Editor Only -->
				<template v-if="isInEditMode || (!isInEditMode && isLocked)">
					<ButtonIconOnly isInline :icon="isLocked ? IconLockSolid : IconLock" @click="handleNoteLockAction">
						Note is {{ isLocked ? 'locked' : 'unlocked' }}. Click to {{ isLocked ? 'unlock' : 'lock' }}
					</ButtonIconOnly>

					<!-- --- Seperator --- -->
					<span v-if="isInEditMode" aria-hidden="true" class="h-5 rounded-full border-r border-gray-700" />
				</template>
				
				<!-- Collections & Hide: Non-Editor Only (Readonly) -->
				<template v-if="!isInEditMode">
					<ContextMenu v-if="!collection" :isDisabled="isLocked" @changedOpenState="newVal => $emit('changedOpenState', newVal)">
						<template #button>
							<ButtonIconOnly isInline is="div" :icon="IconCollectionMove" :isDisabled="isLocked">
								Move note to collection
							</ButtonIconOnly>
						</template>

						<ContextMenu-Item
							v-for="collection of allCollections" :key="collection.id" 
							@click="() => handleAddCollection({ collectionId: collection.id })">
							
							{{ collection.title }}
						</ContextMenu-Item>
					</ContextMenu>
				</template>

				<template v-if="isInEditMode || (!isInEditMode && !isLocked)">
					<!-- Hide -->
					<ButtonIconOnly isInline :icon="note.is_hidden ? IconEyeOffSolid : IconEyeOff" @click="handleNoteHideAction" :isDisabled="isLocked">
						Note is {{ note.is_hidden ? 'hidden' : 'visible' }}. Click to {{ note.is_hidden ? 'unhide' : 'hide' }}.
					</ButtonIconOnly>

					<!-- Pin -->
					<ButtonIconOnly isInline :icon="note.is_pinned ? IconPinSolid : IconPin" @click="handleNotePinAction" :isDisabled="isLocked">
						Note is {{ note.is_pinned ? 'pinned' : 'not pinned' }}. Click to {{ note.is_pinned ? 'unpin' : 'pin' }}.
					</ButtonIconOnly>

					<!-- Archive -->
					<ButtonIconOnly isInline :icon="note.is_archived ? IconArchiveSolid : IconArchive" @click="handleNoteArchiveAction" :isDisabled="isLocked">
						Note is {{ note.is_archived ? 'archived' : 'not archived' }}. Click to {{ note.is_archived ? 'unarchive' : 'archive' }}.
					</ButtonIconOnly>

					<!-- Trash -->
					<ButtonIconOnly isInline :icon="IconTrash" @click="handleNoteMoveToDeleted" :isDisabled="isLocked">
						Click to delete note
					</ButtonIconOnly>
				</template>
			</template>
			
			<template v-else>
				<ButtonIconOnly isInline :icon="IconTrashUndo" @click="handleNoteMoveOutOfDeleted">
					Click to undo deletion
				</ButtonIconOnly>

				<ButtonIconOnly isInline :icon="IconTrashDelete" @click="handleNoteFullyDelete">
					Click to permanently delete note from trash
				</ButtonIconOnly>
			</template>
		</div>
	</div>
</template>

<script setup>	
	import { computed } from 'vue'
	import useConfirm from '@/hooks/useConfirm'
	import { notesStore, collectionsStore } from '@/store' 
	import useSupabase from '@/hooks/useSupabase'
	import { 
		IconEyeOff, IconEyeOffSolid, IconPin, IconPinSolid, 
		IconTrash, IconTrashDelete, IconTrashUndo, IconArchive, IconArchiveSolid,
		IconCollectionMove, IconLock, IconLockSolid
	} from '@/assets/icons'

	// Components
	import { ButtonIconOnly, ContextMenu, ContextMenuItem } from '@/components/ui'
	import { NoteActionBarCollection } from '@/components'

	const supabase = useSupabase()

	const props = defineProps({
		note: 								{ required: true },
		displayButtons: 			{ type: Boolean, default: true },
		isInEditMode: 				{ type: Boolean, default: false },

		/**
		 * There are two ways to use the ActionBar:
		 * - updateStore: When property updates, the ActionBar will fire a store action. Used for note component.
		 * - emitChanges: When property updates, the ActionBar will only emit an event with these changes. Used for note editor component.
		 */
		mode: { type: String, default: 'updateStore', validator: v => ['updateStore', 'emitChanges'].includes(v) },
	})

	const emit = defineEmits([ 'updatedNote', 'changedOpenState' ])

	const isEmitChangesMode = computed(() => props.mode === 'emitChanges')
	const isLocked = computed(() => props.note.is_locked)
	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const allCollections = computed(() => collectionsStore.state.collections)


	/** Actions */

	const _updateNoteProperty = ( newVal = {} ) => {
		if (isEmitChangesMode.value)
			emit('updatedNote', newVal)
		else 
			if (newVal.deleted_at !== undefined)
				notesStore.notesUpdateSingleDeletedState({ noteId: props.note.id, deleted_at: newVal.deleted_at })
			else if (newVal.collection_id !== undefined)
				notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId: newVal.collection_id })
			else 
				notesStore.notesUpdateSingle({ noteId: props.note.id, newVal })
	} 

	const handleNoteLockAction = () => {
		_updateNoteProperty({ is_locked: !isLocked.value })
	}

	const handleNotePinAction = () => {
		_updateNoteProperty({ is_pinned: !props.note.is_pinned })
	}

	const handleNoteArchiveAction = () => {
		_updateNoteProperty({ is_archived: !props.note.is_archived })
	}

	const handleNoteHideAction = async () => {
		const answer = await useConfirm().doConfirm({ 
			title: `${ props.note.is_hidden ? 'Make this note visible again' : 'Hide this note' }?`,
			question: 'You can always undo this at anytime.' 
		})

		if (!answer)
			return

		_updateNoteProperty({ is_hidden: !props.note.is_hidden })
	}

	const handleNoteMoveToDeleted = () => {
		_updateNoteProperty({ deleted_at: new Date() })
	}

	const handleNoteMoveOutOfDeleted = () => {
		_updateNoteProperty({ deleted_at: null })
	}

	const handleNoteFullyDelete = async () => {
		const answer = await useConfirm().doConfirm({ 
			title: 'Delete this note permanently?',
			question: 'Do you want to delete this note permanently?<br>You can\'t undo this.' 
		})

		if (!answer)
			return

		// no handling of the props.mode here, because we want to delete the note completely
		
		return notesStore.notesDeleteV2({ noteIds: [ props.note.id ] })
	}

	const handleAddCollection = ({ collectionId }) => {
		_updateNoteProperty({ collection_id: collectionId })
	}

	const handleRemoveCollection = () => {
		_updateNoteProperty({ collection_id: null })
	}
</script>