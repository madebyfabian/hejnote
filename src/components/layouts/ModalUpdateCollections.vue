<template>
	<Modal 
		:isOpened="updateCollectionsModalVisible"
		@close="updateCollectionsModalVisible = false"
		title="Your collections">

		<div class="-mx-4 mb-4">
			<Cell v-for="collection of collectionsStore.state.collections" :key="collection.id" size="200" dividerInset>
				{{ collection.title }}
				<template #contentRight>
					<div class="flex gap-1 -m-2 ml-0">
						<Button buttonType="tertiary" isIconOnly @click="() => handleUpdateCollection({ collectionId: collection.id })">
							<IconEdit />
							<div class="sr-only">Edit collection "{{ collection.title }}"</div>
						</Button>

						<Button buttonType="tertiary" isIconOnly @click="() => handleUpdateCollection({ collectionId: collection.id, doDelete: true })">
							<IconTrashDelete />

							<div class="sr-only">Delete collection "{{ collection.title }}"</div>
						</Button>
					</div>
				</template>
			</Cell>
		</div>

		<Button buttonType="secondary" isFullWidth @click="handleAddNewCollection">
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
	import { TextInput, Cell, Button, Modal } from '@/components/ui'
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

	const handleAddNewCollection = async () => {
		const answer = await useConfirm().doConfirm({ 
			title: 'Add new collection',
			inputProps: {
				placeholder: 'Name'
			}
		})
		if (!answer) return

		collectionsStore.collectionsInsertSingle({ newVal: { title: answer } })
	}
</script>