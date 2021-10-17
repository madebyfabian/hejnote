<template>
	<ul 
		v-if="noteLinks?.length"
		class="Note-LinkList divide-y-2 bg-opacity-50 bg-gray-700 divide-gray-800" 
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
	</ul>
</template>

<script setup>
	import { computed } from 'vue'
	import { linksStore, joinNotesLinksStore } from '@/store'
	import useConfirm from '@/hooks/useConfirm'

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
			message: `Are you sure you want to delete this link?`
		})

		if (!answer)
			return

		linksStore.linksDeleteV2({ urlArray: [ url ], noteIds: [ props.noteId ] })
	}
</script>