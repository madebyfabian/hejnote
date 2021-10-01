<template>
	<div class="Note-CollectionBar">
		<div v-if="!collection">
			<ContextMenu 
				:isOpened="isOpened" 
				@toggleIsOpened="newVal => isOpened = newVal"
				:buttonProps="{ isIconOnly: true, buttonType: 'secondary', hideBorder: true }">

				<template #button>
					<IconCollectionMove />
				</template>

				<li v-for="collection of allCollections" :key="collection.id">
					<Cell isClickable @click="() => handleAddCollection({ collectionId: collection.id })">
						{{ collection.title }}
					</Cell>
				</li>

				<!--

				<li><ContextMenu-Seperator /></li>

				<li>
					<Cell isClickable>
						Add new Collection...
					</Cell>
				</li>

				-->
			</ContextMenu>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import ContextMenu from '@/components/ContextMenu.vue'
	import ContextMenuSeperator from '@/components/ContextMenu-Seperator.vue'
	import { IconCollectionMove } from '@/assets/icons'
	import { collectionsStore, notesStore } from '@/store'
	import { Button, Cell } from '@/components/ui'

	const props = defineProps({
		note: { type: [ Object, null ], required: true }
	})

	const isOpened = ref(false)

	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const allCollections = computed(() => collectionsStore.state.collections)

	const handleAddCollection = ({ collectionId }) => {
		isOpened.value = false
		notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId })
	}
</script>