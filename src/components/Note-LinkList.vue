<template>
	<ul 
		v-if="noteLinks?.length"
		class="Note-LinkList rounded-xl border border-gray-700 divide-y divide-gray-700" 
		:class="{ isReadonly }">

		<li 
			v-for="link in noteLinks" :key="link.id" 
			class="flex justify-between items-center">

			<component 
				:is="isReadonly ? 'a' : 'div'"
				:href="isReadonly ? link.url : undefined"
				:title="isReadonly ? link.title : undefined"
				:target="isReadonly ? '_blank' : undefined"
				:rel="isReadonly ? 'noopener noreferrer' : undefined"
				class="flex group"
				:class="[ horizontalGapClass, spacingClass ]">

				<!-- Image -->
				<div class="relative rounded-lg overflow-hidden" :class="isReadonly ? 'w-10 h-10' : 'w-14 h-14'">
					<div
						class="bg-gray-600 w-full h-full bg-cover bg-center flex-shrink-0 flex items-center justify-center text-gray-500"
						:style="generateBannerStyle(link?.banner_url)">

						<IconGlobe v-if="!link?.banner_url" />
					</div>

					<div 
						v-if="isReadonly"
						class="
							absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75
							transition-opacity opacity-0 group-hover:opacity-100
						" 
						aria-hidden="false">

						<span class="transition-transform transform-gpu translate-y-1.5 group-hover:translate-y-0">
							<IconLinkExternal />
						</span>
					</div>
				</div>

				<!-- Content -->
				<div 
					:set="join = findJoinByLinkId(link.id)"
					class="flex-1 flex flex-col justify-center">
					
					<span v-if="link.title" class="block line-clamp-1 break-all">{{ link.title }}</span>

					<div 
						:set="hasOptionToKeepAnyway = !join?.is_in_text && join.is_added_from_text"
						class="text-050 flex text-gray-500">

						<HostnameLabel :url="link.url" />
						<template v-if="!isReadonly">
							<span class="block mx-1">&mdash;</span>

							<template v-if="hasOptionToKeepAnyway">
								<span>Not in note anymore.</span>
								&nbsp;
								<Button buttonType="inline" isText050 @click="handleKeepLinkAfterDeletingFromNote({ join })">
									Keep anyway
								</Button>
							</template>

							<span v-else>{{ join?.is_added_from_text ? 'Found in note' : 'Added by you' }}</span>
						</template>
					</div>

					<div v-if="!isReadonly && join?.annotation" class="mt-1 text-050">"{{ join.annotation }}"</div>
				</div>
			</component>

			<!-- Edit options -->
			<div v-if="!isReadonly" class="pl-0 text-gray-300" :class="[ spacingClass ]">
				<Button buttonType="secondary" hideBorder isIconOnly hasNegativeMargin>
					<IconEdit />
					<span class="sr-only">Edit link <span v-if="link.title">"{{ link.title }}"</span></span>
				</Button>
			</div>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue'
	import { IconGlobe, IconEdit, IconLinkExternal } from '@/assets/icons'
	import { linksStore, joinNotesLinksStore } from '@/store'
	import { HostnameLabel, Button } from '@/components/ui'

	const props = defineProps({
		noteId: 		{ type: String, required: true },
		isReadonly: { type: Boolean, default: false },
	})

	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ props.noteId ] }))
	const noteJoinLinks = computed(() => joinNotesLinksStore.findJoinNotesLinksByNoteIds({ noteIds: [ props.noteId ] }))
	const horizontalGapClass = computed(() => props.isReadonly ? 'gap-2' : 'gap-3')
	const spacingClass = computed(() => props.isReadonly ? 'p-3' : 'p-4')

	// Methods
	const generateBannerStyle = ( banner_url ) => {
		return banner_url 
			? `background-image: url('${ banner_url }')`
			: ''
	}

	const findJoinByLinkId = ( linkId ) => {
		return noteJoinLinks.value.find(join => join.link_id === linkId)
	}

	const handleKeepLinkAfterDeletingFromNote = ({ join }) => {
		joinNotesLinksStore.joinNotesLinksUpdate({ joinIds: [ join.id ], noteId: props.noteId, newVal: {
			is_added_from_text: false,
		}})
	}
</script>