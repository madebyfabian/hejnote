<template>
	<div class="Note-CollectionBar">
		<div v-if="collection" class="Note-CollectionBar-badgeGroup">
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
	import { computed } from 'vue'
	import { IconClose } from '@/assets/icons'
	import { collectionsStore, notesStore } from '@/store'
	import { Badge } from '@/components/ui'

	const props = defineProps({
		note: { type: [ Object, null ], required: true }
	})

	const collection = computed(() => collectionsStore.collectionFindById({ collectionId: props.note.collection_id }))

	const handleRemoveCollection = () => {
		notesStore.notesUpdateSingleCollectionId({ noteId: props.note.id, collectionId: null })
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