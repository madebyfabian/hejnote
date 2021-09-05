<template>
	<ul class="Note-LinkList rounded-lg overflow-hidden">
		<li v-for="link in noteLinks" :key="link.id" class="mb-0.5 last:mb-0">
			<a 
				:href="link.url"
				:title="link.title"
				class="flex bg-gray-700 cursor-pointer" 
				target="_blank" 
				rel="noopener noreferrer nofollow">

				<div
					class="w-20 bg-gray-600 bg-cover bg-center flex-shrink-0"
					:style="generateBannerStyle(link?.banner_url)">
				</div>

				<div class="p-3 overflow-hidden">
					<h4 class="line-clamp-2">{{ link.title }}</h4>
					<p class="text-050 text-gray-500">{{ useGetUrlHost(link.url) }}</p>
				</div>
			</a>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue'
	import { linksStore } from '@/store'
	import useGetUrlHost from '@/hooks/useGetUrlHost'

	const props = defineProps({
		noteId: { type: String, required: true },
	})

	const noteLinks = computed(() => linksStore._findLinksByNoteId({ noteId: props.noteId }))

	const generateBannerStyle = ( banner_url ) => {
		return banner_url 
			? `background-image: url('${ banner_url }')`
			: ''
	}
</script>