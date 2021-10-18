<template>
	<ul 
		class="Note-LinkList divide-y-2 bg-opacity-50 bg-gray-700 divide-gray-800 overflow-hidden" 
		:class="{ 
			isReadonly, 
			'': displayAsLinkOnly,
			'rounded-xl': !displayAsLinkOnly,
		}">

		<Note-LinkList-Item
			v-for="link in noteLinks" 
			:key="link.id"
			v-bind="{ ...$props, link }"
			@handleLinkDelete="handleLinkDelete"
			@handleKeepLinkAfterDeletingFromNote="handleKeepLinkAfterDeletingFromNote"
		/>

		<li v-if="!isReadonly">
			<Button buttonType="secondary" hideBorder isFullWidth noRoundedBorder @click="createLinkModalIsOpened = true">
				<IconAdd />
				Add new link
			</Button>
		</li>
	</ul>

	<Modal 
		:isOpened="createLinkModalIsOpened" 
		@close="createLinkModalIsOpened = false"
		@formSubmit="handleCreateLinkModalSubmit"
		title="Add new link" 
		width="100" 
		isForm>

		<div class="flex flex-col gap-4">
			<TextInput v-model="createLinkModalData.url" :inputProps="{ type: 'url', placeholder: 'Your Link', required: true }" />
			<TextInput v-model="createLinkModalData.annotation" :inputProps="{ placeholder: 'Annotations for this link' }" />
		</div>

		<template #bottomBar>
			<Button type="submit" isFullWidth :isLoading="createLinkModalButtonLoading">Save</Button>
		</template>
	</Modal>
</template>

<script setup>
	import { computed, reactive, ref } from 'vue'
	import { linksStore, joinNotesLinksStore } from '@/store'
	import useConfirm from '@/hooks/useConfirm'
	import useSnackbar from '@/hooks/useSnackbar'
	import { Button, Modal, TextInput } from '@/components/ui'
	import { IconAdd, IconTrashDelete } from '@/assets/icons'

	// !! Must be a direct import, otherwise props importing doesn't work.
	import NoteLinkListItem from '@/components/Note-LinkList-Item.vue'

	const props = defineProps({
		...NoteLinkListItem.props,

		// Set child component's props to undefined.
		link: undefined
	})

	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ props.noteId ] }))

	const handleKeepLinkAfterDeletingFromNote = ({ join }) => {
		joinNotesLinksStore.joinNotesLinksUpdate({ joinIds: [ join.id ], noteId: props.noteId, newVal: {
			is_added_from_text: false,
		}})
	}

	const handleLinkDelete = async ({ url }) => {
		const answer = await useConfirm().doConfirm({
			title: 'Delete link',
			question: `Are you sure you want to delete this link?<br>This can't be undone.`
		})

		if (!answer)
			return

		linksStore.linksDeleteV2({ urlArray: [ url ], noteIds: [ props.noteId ] })
	}

	/**
	 * Create link modal
	 */
	const createLinkModalIsOpened = ref(false)
	const _default_createLinkModalData = {
		url: '',
		annotation: ''
	}
	const createLinkModalData = reactive({ ..._default_createLinkModalData })
	const createLinkModalButtonLoading = ref(false)

	const handleCreateLinkModalSubmit = async () => {
		createLinkModalButtonLoading.value = true

		try {
			await linksStore.linksInsert({ 
				urlArray: [ createLinkModalData.url ], 
				noteId: props.noteId,
				isAddedFromText: false,
				isInText: false,
				annotation: createLinkModalData.annotation || null,
			})

			createLinkModalIsOpened.value = false

			// Reset data.
			Object.assign(createLinkModalData, _default_createLinkModalData)

		} catch (error) {
			useSnackbar().createSnackbar({ message: 'Error while trying to create new link' })

		} finally {
			createLinkModalButtonLoading.value = false
		}
	}
</script>