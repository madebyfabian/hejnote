<template>
	<div 
		class="Note-LinkList-Item flex items-center group w-full gap-3"
		:class="displayAsLinkOnly ? 'px-4 py-3' : 'p-3'">

		<!-- Image -->
		<div class="
			relative rounded-lg overflow-hidden w-10 h-10 self-start bg-gray-800 text-gray-500 shrink-0 
			flex items-center justify-center" 
			aria-hidden="true">

			<img 
				v-if="displayLinkImage" 
				:src="link.banner_url" 
				@error="handleImageLoadingError"
				loading="lazy"
				class="w-full h-full object-cover object-center"
			/>

			<IconGlobe v-else />
		</div>

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
						<span class="block line-clamp-1 break-all">Not in note anymore.</span>
						&nbsp;
						<Button buttonType="inline" class="!text-050" @click="$emit('handleKeepLinkAfterDeletingFromNote', { join: currentLinkJoin })">
							Keep anyway
						</Button>
					</template>

					<span class="shrink-0" v-else>{{ currentLinkJoin?.is_added_from_text ? 'Found in note' : 'Added by you' }}</span>
				</template>
			</div>

			<div v-if="currentLinkJoin?.annotation" class="mt-1 text-050">"{{ currentLinkJoin.annotation }}"</div>
		</div>

		<!-- Edit options -->
		<div 
			class="flex gap-5 text-gray-300 transition-opacity 
				desktop:opacity-0 
				desktop:group-hover:opacity-100 
				desktop:group-focus-within:opacity-100">

			<ButtonIconOnly v-if="isReadonly" isInline :icon="copyIcon" @click.stop="handleCopyLink">
				Copy link <span v-if="link.title">"{{ link.title }}"</span>
			</ButtonIconOnly>
			
			<ButtonIconOnly v-if="!isReadonly" isInline :icon="IconTrashDelete" @click.stop="$emit('handleLinkDelete', { url: link.url })">
				Delete link <span v-if="link.title">"{{ link.title }}"</span>
			</ButtonIconOnly>

			<AppLink v-bind="{ to: props.link.url, title: props.link.title, target: '_blank' }" @click.stop="() => {}">
				<ButtonIconOnly is="div" isInline :icon="IconLinkExternal">
					Open "{{ props.link.url }}"
				</ButtonIconOnly>
			</AppLink>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { joinNotesLinksStore, linksStore } from '@/store'
	import { HostnameLabel, Button, ButtonIconOnly, AppLink } from '@/components/ui'
	import { IconGlobe, IconLinkExternal, IconTrashDelete, IconCopy, IconCheck, IconMore } from '@/assets/icons'
	import handleError from '@/utils/handleError'

	const emit = defineEmits([ 'handleLinkDelete', 'handleKeepLinkAfterDeletingFromNote' ])

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

	const copyIcon = ref(IconCopy)
	const displayLinkImage = ref(props.link?.banner_url)

	const handleImageLoadingError = () => {
		displayLinkImage.value = false
	}

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(props.link.url)
			copyIcon.value = IconCheck
			setTimeout(() => {
				copyIcon.value = IconCopy
			}, 1500)

		} catch (error) {
			handleError(new Error('Error while trying to copy to clipboard.'))
		}
	}
</script>