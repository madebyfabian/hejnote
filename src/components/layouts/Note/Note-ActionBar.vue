<template>
	<div v-if="showActionBar" class="Note-ActionBar flex items-center gap-2 justify-end">
		<div class="flex items-center flex-1 -my-0.5">
			<Note-ActionBar-Collection 
				v-bind="{ 
					collection, 
					isReadonly: isLocked || (isMobileDevice && !isInEditMode) 
				}" 
				@removeCollection="() => handleRemoveCollection()" 
			/>
		</div>

		<div 
			v-if="isLocked || !isMobileDevice || (isMobileDevice && isInEditMode)"
			class="Note-ActionBar flex gap-5 transition-opacity" 
			:class="{ 'desktop:opacity-0': !displayButtons }"
			role="toolbar">

			<template v-if="!note.deleted_at">
				<!-- Lock: Inside Editor Only -->
				<template v-if="isInEditMode || (!isInEditMode && isLocked)">
					<ButtonIconOnly isInline :icon="isLocked ? IconLockSolid : IconLock" @click.stop="handleNoteLockAction">
						Note is {{ isLocked ? 'locked' : 'unlocked' }}. Click to {{ isLocked ? 'unlock' : 'lock' }}
					</ButtonIconOnly>

					<!-- --- Seperator --- -->
					<span v-if="isInEditMode" aria-hidden="true" class="h-5 rounded-full border-r border-gray-700" />
				</template>	

				<template v-if="isInEditMode || (!isInEditMode && !isLocked)">
					<!-- Collections -->
					<ContextMenuCollections
						v-if="!collection"
						:isDisabled="isLocked" 
						@changedOpenState="newVal => $emit('changedOpenState', newVal)"
						@itemClicked="({ collection }) => handleAddCollection({ collectionId: collection.id })">

						<template #button>
							<ButtonIconOnly isInline is="div" :icon="IconCollectionMove" :isDisabled="isLocked">
								Move note to collection
							</ButtonIconOnly>
						</template>
					</ContextMenuCollections>

					<!-- Hide -->
					<ButtonIconOnly isInline :icon="note.is_hidden ? IconEyeOffSolid : IconEyeOff" @click.stop="handleNoteHideAction" :isDisabled="isLocked">
						Note is {{ note.is_hidden ? 'hidden' : 'visible' }}. Click to {{ note.is_hidden ? 'unhide' : 'hide' }}.
					</ButtonIconOnly>

					<!-- Pin -->
					<ButtonIconOnly v-if="!isCurrentlyInArchiveRoute" isInline :icon="note.is_pinned ? IconPinSolid : IconPin" @click.stop="handleNotePinAction" :isDisabled="isLocked">
						Note is {{ note.is_pinned ? 'pinned' : 'not pinned' }}. Click to {{ note.is_pinned ? 'unpin' : 'pin' }}.
					</ButtonIconOnly>

					<!-- Archive -->
					<ButtonIconOnly isInline :icon="note.is_archived ? IconArchiveUndo : IconArchive" @click.stop="handleNoteArchiveAction" :isDisabled="isLocked">
						Note is {{ note.is_archived ? 'archived' : 'not archived' }}. Click to {{ note.is_archived ? 'unarchive' : 'archive' }}.
					</ButtonIconOnly>

					<!-- Trash -->
					<ButtonIconOnly isInline :icon="IconTrash" @click.stop="handleNoteMoveToDeleted" :isDisabled="isLocked">
						Click to move note to trash.
					</ButtonIconOnly>
				</template>
			</template>
			
			<template v-else>
				<ButtonIconOnly isInline :icon="IconTrashUndo" @click.stop="handleNoteMoveOutOfDeleted">
					Click to undo deletion
				</ButtonIconOnly>

				<ButtonIconOnly isInline :icon="IconTrashDelete" @click.stop="handleNoteFullyDelete">
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
	import { useRoute } from 'vue-router'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'
	import { 
		IconEyeOff, IconEyeOffSolid, IconPin, IconPinSolid, 
		IconTrash, IconTrashDelete, IconTrashUndo, IconArchive, IconArchiveUndo,
		IconCollectionMove, IconLock, IconLockSolid
	} from '@/assets/icons'

	// Components
	import { ButtonIconOnly } from '@/components/ui'
	import { NoteActionBarCollection, ContextMenuCollections } from '@/components/layouts'

	const emit = defineEmits([ 'updatedNote', 'changedOpenState' ])

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

	const supabase = useSupabase()
	const route = useRoute()
	const isMobileDevice = useIsMobileDevice()

	const isEmitChangesMode = computed(() => props.mode === 'emitChanges')
	const isLocked = computed(() => props.note.is_locked)
	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const isCurrentlyInArchiveRoute = computed(() => route.name === 'App-Archive')
	const showActionBar = computed(() => {
		if (collection.value) return true
		if (!isMobileDevice.value) return true
		if (isMobileDevice.value) 
			if (props.isInEditMode || isLocked.value) return true
		
		return false
	})


	/** Actions */

	const _updateNoteProperty = ( newVal = {} ) => {
		if (isEmitChangesMode.value)
			emit('updatedNote', newVal)
		else 
			if (newVal.deleted_at !== undefined)
				notesStore.notesUpdateSingleDeletedState({ noteId: props.note.id, deleted_at: newVal.deleted_at })
			else if (newVal.is_archived !== undefined && newVal.is_archived !== props.note.is_archived)
				notesStore.notesUpdateSingleArchivedState({ noteId: props.note.id, is_archived: newVal.is_archived })
			else if (newVal.collection_id !== undefined)
				notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId: newVal.collection_id })
			else if (newVal.is_hidden !== undefined)
				notesStore.notesUpdateSingleHiddenState({ noteId: props.note.id, is_hidden: newVal.is_hidden })
			else 
				notesStore.notesUpsertSingle({ note: { ...newVal, id: props.note.id } })
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
		
		return notesStore.notesDelete({ noteIds: [ props.note.id ] })
	}

	const handleAddCollection = ({ collectionId }) => {
		_updateNoteProperty({ collection_id: collectionId })
	}

	const handleRemoveCollection = () => {
		_updateNoteProperty({ collection_id: null })
	}
</script>