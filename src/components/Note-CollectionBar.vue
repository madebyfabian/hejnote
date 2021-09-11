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

				<li><ContextMenu-Seperator /></li>

				<li>
					<Cell isClickable>
						Add new Collection...
					</Cell>
				</li>
			</ContextMenu>
		</div>

		<div v-else class="Note-CollectionBar-badgeGroup">
			<Badge>{{ collection.title }}</Badge>
			<button class="Note-CollectionBar-badgeButton" @click="handleRemoveCollection">
				<span 
					aria-hidden="true" 
					class="absolute -left-4 top-0 w-9 h-full bg-gradient-to-r from-transparent via-gray-800 to-gray-800" 
				/>
				<span class="relative">
					<IconClose />
				</span>
			</button>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import Button from '@/components/Button.vue'
	import Cell from '@/components/Cell.vue'
	import ContextMenu from '@/components/ContextMenu.vue'
	import ContextMenuSeperator from '@/components/ContextMenu-Seperator.vue'
	import { IconCollectionMove, IconClose } from '@/assets/icons'
	import { collectionsStore, notesStore } from '@/store'
	import Badge from '@/components/Badge.vue'

	const props = defineProps({
		note: { type: [ Object, null ], required: true }
	})

	const isOpened = ref(false)

	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))
	const allCollections = computed(() => collectionsStore.state.collections)

	const handleRemoveCollection = () => {
		notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId: null })
	}

	const handleAddCollection = ({ collectionId }) => {
		isOpened.value = false
		notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId })
	}
</script>

<style lang="postcss" scoped>
	.Note-CollectionBar {
		&-badgeGroup {
			@apply ml-2 relative;
		}

		&-badgeButton {
			@apply absolute right-1 top-0.5 transition opacity-0 rounded;
		}

		&-badgeGroup:hover &-badgeButton,
		&-badgeGroup:focus-within &-badgeButton {
			@apply opacity-100;
		}
	}
</style>