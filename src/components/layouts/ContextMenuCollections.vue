<template>
	<ContextMenu v-bind="{ ...$props, isTypeNavigation: undefined, ...$attrs }">
		<template #button>
			<slot name="button" />
		</template>

		<div>
			<ContextMenu-Item 
				v-if="collectionsStore.state.collections?.length"
				@click="generalStore.updateUpdateCollectionsModalVisible({ newVal: true })">

				Edit or add Collections...
			</ContextMenu-Item>

			<ContextMenu-Item 
				v-else
				@click="() => collectionsStore.handleAddNewCollection()">
					
				Add new Collection...
			</ContextMenu-Item>
		</div>

		<ContextMenu-Seperator />

		<ContextMenu-Item
			v-for="collection of collectionsStore.state.collections" 
			:key="collection.id"
			@click="emit('itemClicked', { collection })"
			:cellProps="props.isTypeNavigation ? { 
				isSelected: collection.id === route.params?.collectionId,
				isTypeNavigation: true,
				navigateTo: { name: 'App-Collection', params: { collectionId: collection.id } }
			} : {}">
			
			{{ collection.title }}
		</ContextMenu-Item>
		
		<ContextMenu-Item v-if="!collectionsStore.state.collections?.length" disabled>
			<EmptyState>
				You don't have any collections yet.
			</EmptyState>
		</ContextMenu-Item>
	</ContextMenu>
</template>

<script setup>
	import { useRoute } from 'vue-router'
	import { generalStore, collectionsStore } from '@/store'
	import { ContextMenu, ContextMenuItem, ContextMenuSeperator, EmptyState } from '@/components/ui'

	const emit = defineEmits([ 'itemClicked' ])

	const props = defineProps({
		...ContextMenu.props,
		isTypeNavigation: { type: Boolean, default: false }
	})

	const route = useRoute()
</script>