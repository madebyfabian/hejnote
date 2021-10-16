<template>
	<div class="flex items-center -mx-2 -mb-1.5 gap-2 justify-end">
		<div class="flex items-center flex-1">
			<Note-ActionBar-Collection v-bind="{ note, collection, isReadonly: isLocked }" @removeCollection="() => handleRemoveCollection()" />
		</div>

		<div 
			class="Note-ActionBar flex items-center gap-1 transition-opacity" 
			:class="{ 'desktop:opacity-0': !displayButtons }"
			role="toolbar">

			<template v-if="!note.deleted_at">
				<!-- Editor Only -->
				<template v-if="isInEditMode">
					<!-- Lock -->
					<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteLockAction">
						<IconLock v-if="!isLocked" />
						<IconLockSolid v-else />
						<span class="sr-only">Note is {{ isLocked ? 'locked' : 'unlocked' }}. Click to {{ isLocked ? 'unlock' : 'lock' }}</span>
					</Button>

					<!-- --- Seperator --- -->
					<span aria-hidden="true" class="h-5 rounded-full mx-2 border-r border-gray-700" />
				</template>
				
				<template v-if="!isInEditMode">
					<ContextMenu v-if="!collection" @changedOpenState="newVal => $emit('changedOpenState', newVal)">
						<template #button>
							<Button isIconOnly buttonType="secondary" hideBorder is="div">
								<IconCollectionMove />
							</Button>
						</template>

						<ContextMenu-Item
							v-for="collection of allCollections" :key="collection.id" 
							@click="() => handleAddCollection({ collectionId: collection.id })">
							
							{{ collection.title }}
						</ContextMenu-Item>
					</ContextMenu>

					<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteHideAction" :isDisabled="isLocked">
						<IconEyeOff v-if="!note.is_hidden" />
						<IconEyeOffSolid v-else />
					</Button>
				</template>

				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNotePinAction" :isDisabled="isLocked">
					<IconPin v-if="!note.is_pinned" />
					<IconPinSolid v-else />
				</Button>

				<!-- Archive -->
				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteArchiveAction" :isDisabled="isLocked">
					<IconArchive v-if="!note.is_archived" />
					<IconArchiveSolid v-else />
				</Button>

				<!-- Trash -->
				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteMoveToDeleted" :isDisabled="isLocked">
					<IconTrash />
				</Button>
			</template>
			
			<template v-else>
				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteMoveOutOfDeleted">
					<IconTrashUndo />
				</Button>
				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteFullyDelete">
					<IconTrashDelete />
				</Button>
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
	import { Button, RichtextEditor, ContextMenu, ContextMenuItem } from '@/components/ui'
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