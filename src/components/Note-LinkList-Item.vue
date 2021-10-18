<template>
	<li 
		class="Note-LinkList-Item flex items-center group w-full gap-3"
		:class="displayAsLinkOnly ? 'p-4' : 'p-3'">

		<!-- Image -->
		<a
			:href="link.url"
			:title="link.title"
			target="_blank"
			rel="noopener noreferrer"
			class="relative block rounded-lg overflow-hidden w-10 h-10 self-start">

			<div
				class="bg-gray-600 w-full h-full bg-cover bg-center flex-shrink-0 flex items-center justify-center text-gray-500"
				:style="generateBannerStyle(link?.banner_url)">

				<IconGlobe v-if="!link?.banner_url" />
			</div>

			<div 
				class="
					absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-90
					transition-opacity opacity-0 group-hover:opacity-100
				" 
				aria-hidden="false">

				<span class="transition-transform transform-gpu translate-y-1.5 group-hover:translate-y-0">
					<IconLinkExternal />
				</span>
			</div>
		</a>

		<!-- Content -->
		<div class="flex-1 flex flex-col justify-center">
			<span v-if="link.title" class="block line-clamp-1 break-all">{{ link.title }}</span>

			<div 
				:set="hasOptionToKeepAnyway = !currentLinkJoin?.is_in_text && currentLinkJoin.is_added_from_text"
				class="text-050 flex text-gray-500">

				<HostnameLabel :url="link.url" />
				<template v-if="!isReadonly">
					<span class="block mx-1">&mdash;</span>

					<template v-if="hasOptionToKeepAnyway">
						<span>Not in note anymore.</span>
						&nbsp;
						<Button buttonType="inline" isText050 @click="$emit('handleKeepLinkAfterDeletingFromNote', { join: currentLinkJoin })">
							Keep anyway
						</Button>
					</template>

					<span v-else>{{ currentLinkJoin?.is_added_from_text ? 'Found in note' : 'Added by you' }}</span>
				</template>
			</div>

			<div v-if="currentLinkJoin?.annotation" class="mt-1 text-050">"{{ currentLinkJoin.annotation }}"</div>
		</div>

		<!-- Edit options -->
		<div 
			v-if="!isReadonly" 
			class="flex gap-5 text-gray-300 mr-2
				transition-opacity opacity-0 
				group-hover:opacity-100 
				group-focus-within:opacity-100 
				group-focus:opacity-100">
			
			<ButtonIconOnly isInline :icon="IconTrashDelete" @click="$emit('handleLinkDelete', { url: link.url })">
				Delete link <span v-if="link.title">"{{ link.title }}"</span>
			</ButtonIconOnly>
		</div>
	</li>
</template>

<script setup>
	import { computed } from 'vue'
	import { joinNotesLinksStore } from '@/store'
	import { HostnameLabel, Button, ButtonIconOnly } from '@/components/ui'
	import { IconGlobe, IconEdit, IconLinkExternal, IconTrashDelete } from '@/assets/icons'

	defineEmits([ 'handleLinkDelete', 'handleKeepLinkAfterDeletingFromNote' ])

	const props = defineProps({
		// Used together with parent.
		noteId: 						{ type: String, required: true },
		isReadonly: 				{ type: Boolean, default: false },
		displayAsLinkOnly:	{ type: Boolean, default: false },
		
		// Local props
		link: { required: true }
	})

	const currentLinkJoin = computed(() => {
		const noteJoinLinks = joinNotesLinksStore.findJoinNotesLinksByNoteIds({ noteIds: [ props.noteId ] })
		return noteJoinLinks.find(join => join.link_id === props.link?.id)
	})

	const generateBannerStyle = ( banner_url ) => {
		return banner_url 
			? `background-image: url('${ banner_url }')`
			: ''
	}
</script>