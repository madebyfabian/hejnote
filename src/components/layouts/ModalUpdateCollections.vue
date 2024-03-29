<template>
	<Modal 
		:isOpened="updateCollectionsModalVisible"
		@close="updateCollectionsModalVisible = false"
		title="Your collections">

		<div class="-mx-4 mb-4">
			<template v-if="collectionsStore.state.collections?.length">
				<Cell v-for="collection of collectionsStore.state.collections" :key="collection.id" size="200" dividerInset>
					{{ collection.title }}
					<template #contentRight>
						<div class="flex gap-5">
							<ButtonIconOnly isInline :icon="IconEdit" @click="() => handleUpdateCollection({ collectionId: collection.id })">
								Edit collection "{{ collection.title }}"
							</ButtonIconOnly>

							<ButtonIconOnly isInline :icon="IconTrashDelete" @click="() => handleUpdateCollection({ collectionId: collection.id, doDelete: true })">
								Delete collection "{{ collection.title }}"
							</ButtonIconOnly>
						</div>
					</template>
				</Cell>
			</template>
			
			<Cell v-else size="200">
				<EmptyState class="flex items-center desktop:justify-center">
					You don't have any collections yet.
				</EmptyState>
			</Cell>
		</div>

		<Button buttonType="secondary" isFullWidth @click="() => collectionsStore.handleAddNewCollection()">
			<IconAdd />
			Add new
		</Button>
	</Modal>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { generalStore, collectionsStore } from '@/store'
	import useConfirm from '@/hooks/useConfirm'

	// Components
	import { TextInput, Cell, Button, ButtonIconOnly, Modal, EmptyState } from '@/components/ui'
	import { IconTrashDelete, IconEdit, IconAdd } from '@/assets/icons'

	const updateCollectionsModalVisible = computed({
		get: () => generalStore.state.updateCollectionsModalVisible,
		set: ( newVal ) => generalStore.updateUpdateCollectionsModalVisible({ newVal })
	})

	const handleUpdateCollection = async ({ collectionId, doDelete = false }) => {
		const collectionData = collectionsStore.collectionFindById({ collectionId })

		const title = doDelete ? `Delete collection "${ collectionData?.title }"?` : 'Rename collection'
		const question = doDelete ? 'You can\'t undo this.' : null
		const inputProps = doDelete ? null : { placeholder: 'Name', value: collectionData?.title }

		const answer = await useConfirm().doConfirm({ title, question, inputProps })
		if (!answer) return

		if (doDelete) 
			collectionsStore.collectionsDelete({ collectionIds: [ collectionId ] })
		else
			collectionsStore.collectionsUpdateSingle({ collectionId, newVal: { title: answer } })
	}
</script>