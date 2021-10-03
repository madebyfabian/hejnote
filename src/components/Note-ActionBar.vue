<template>
	<div class="flex items-center -mx-2 -mb-1.5" :class="collection ? 'justify-between' : 'justify-end'">
		<Note-ActionBar-Collection v-bind="{ note, collection }" @removeCollection="() => handleRemoveCollection()" />

		<div 
			class="Note-ActionBar flex items-center gap-1 transition-opacity" 
			:class="{ 'opacity-0': !displayButtons }"
			role="toolbar">

			<template v-if="!note.deleted_at">
				<template v-if="!_temp_isInsideModal">
					<ContextMenuV2 v-if="!collection" @changedOpenState="newVal => $emit('changedOpenState', newVal)">
						<template #button>
							<Button isIconOnly buttonType="secondary" hideBorder is="div">
								<IconCollectionMove />
							</Button>
						</template>

						<ContextMenuV2-Item
							v-for="collection of allCollections" :key="collection.id" 
							@click="() => handleAddCollection({ collectionId: collection.id })">
							
							{{ collection.title }}
						</ContextMenuV2-Item>
					</ContextMenuV2>

					<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteHideAction">
						<IconEyeOff v-if="!note.is_hidden" />
						<IconEyeOffSolid v-else />
					</Button>
				</template>

				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNotePinAction">
					<IconPin v-if="!note.is_pinned" />
					<IconPinSolid v-else />
				</Button>

				<!-- Archive -->
				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteArchiveAction">
					<IconArchive v-if="!note.is_archived" />
					<IconArchiveSolid v-else />
				</Button>

				<!-- Trash -->
				<Button isIconOnly buttonType="secondary" hideBorder @click="handleNoteMoveToDeleted">
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
		IconCollectionMove
	} from '@/assets/icons'

	// Components
	import { Button, RichtextEditor } from '@/components/ui'
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'
	import NoteActionBarCollection from '@/components/Note-ActionBar-Collection.vue'

	const supabase = useSupabase()

	const props = defineProps({
		note: 								{ required: true },
		displayButtons: 			{ type: Boolean, default: true },
		_temp_isInsideModal: 	{ type: Boolean, default: false }, // Hide certain items because they have bugs inside modal.

		/**
		 * There are two ways to use the ActionBar:
		 * - updateStore: When property updates, the ActionBar will fire a store action. Used for note component.
		 * - emitChanges: When property updates, the ActionBar will only emit an event with these changes. Used for note editor component.
		 */
		mode: { type: String, default: 'updateStore', validator: v => ['updateStore', 'emitChanges'].includes(v) },
	})

	const emit = defineEmits([ 'updatedNote', 'changedOpenState' ])

	const isEmitChangesMode = computed(() => props.mode === 'emitChanges')
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