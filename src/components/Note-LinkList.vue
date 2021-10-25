<template>
	<section class="Note-LinkList">
		<TruncatedList 
			@truncatedChange="newVal => isTruncated = newVal"
			:items="noteLinks" 
			:disableTruncation="!isReadonly"
			v-bind="{ isTruncated }"
			class="Note-LinkList overflow-hidden divide-y-2"
			:class="{
				'bg-gray-800 bg-opacity-50 divide-gray-900': !isInEditMode,
				'bg-gray-700 bg-opacity-50 divide-gray-800': isInEditMode,
				'rounded-xl': !displayAsLinkOnly,
				isReadonly,
			}"
			wrapperIs="ul"
			itemIs="li">

			<template #item="{ item }">
				<Note-LinkList-Item
					v-bind="{ ...$props, link: item }"
					@handleLinkDelete="handleLinkDelete"
					@handleKeepLinkAfterDeletingFromNote="handleKeepLinkAfterDeletingFromNote"
				/>
			</template>

			<Button v-if="!isReadonly" buttonType="tertiary" isFullWidth noRoundedBorder @click="createLinkModalIsOpened = true">
				<IconAdd />
				Add new link
			</Button>

			<template #expandButton="{ overflowAmount }">
				<Button is="div" buttonType="tertiary" isFullWidth noRoundedBorder :isDropdownOpened="!isTruncated">
					{{ isTruncated ? 'Show' : 'Hide last' }}
					{{ overflowAmount }}
					{{ isTruncated ? 'more' : '' }} 
					link{{ overflowAmount > 1 ? 's' : '' }}
				</Button>
			</template>
		</TruncatedList>
	</section>

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
	import { Button, Modal, TextInput, TruncatedList } from '@/components/ui'
	import { IconAdd, IconTrashDelete } from '@/assets/icons'

	// !! Must be a direct import, otherwise props importing doesn't work.
	import NoteLinkListItem from '@/components/Note-LinkList-Item.vue'

	const props = defineProps({
		...NoteLinkListItem.props,

		// Set child component's props to undefined.
		link: undefined,
		isInEditMode: { type: Boolean, default: false },
	})

	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ props.noteId ] }))

	const isTruncated = ref(true)

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
			await linksStore.linksUpsert({
				linkObjArr: [ linksStore.getLinkDefaultDataObject({ link: { url: createLinkModalData.url } }) ],
				noteId: props.noteId,
				joinNotesLinksObj: {
					is_added_from_text: false,
					is_in_text: false,
					annotation: createLinkModalData.annotation || null,
				}
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