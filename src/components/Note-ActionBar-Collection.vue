<template>
	<div class="Note-CollectionBar">
		<div v-if="!collection">
			<ContextMenuV2>
				<template #button>
					<Button buttonType="secondary" hideBorder isIconOnly is="div">
						<IconCollectionMove />
					</Button>
				</template>

				<ContextMenuV2-Item
					v-for="collection of allCollections" :key="collection.id" 
					@click="() => handleAddCollection({ collectionId: collection.id })">
					
					{{ collection.title }}
				</ContextMenuV2-Item>
			</ContextMenuV2>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { collectionsStore, notesStore } from '@/store'

	import { IconCollectionMove } from '@/assets/icons'
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'
	import { Button } from '@/components/ui'

	const props = defineProps({
		note: { type: [ Object, null ], required: true }
	})

	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const allCollections = computed(() => collectionsStore.state.collections)

	const handleAddCollection = ({ collectionId }) => {
		notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId })
	}
</script>