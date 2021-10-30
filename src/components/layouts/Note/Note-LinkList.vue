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

	<Note-LinkList-EditorModal
		:isOpened="createLinkModalIsOpened"
		:noteId="props.noteId"
		@close="createLinkModalIsOpened = false" 
	/>
</template>

<script setup>
	import { computed, reactive, ref } from 'vue'
	import { linksStore, joinNotesLinksStore } from '@/store'
	import useConfirm from '@/hooks/useConfirm'
	import { Button, TruncatedList } from '@/components/ui'
	import { IconAdd, IconTrashDelete } from '@/assets/icons'

	// !! Must be a direct import, otherwise props importing doesn't work.
	import NoteLinkListItem from '@/components/layouts/Note/Note-LinkList-Item.vue'
	import NoteLinkListEditorModal from '@/components/layouts/Note/Note-LinkList-EditorModal.vue'

	const props = defineProps({
		...NoteLinkListItem.props,

		// Set child component's props to undefined.
		link: undefined,
		isInEditMode: { type: Boolean, default: false },
	})

	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ props.noteId ] }))

	const isTruncated = ref(true)
	const createLinkModalIsOpened = ref(false)

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
</script>