<template>
	<ul class="Note-LinkList rounded-lg overflow-hidden">
		<li v-for="link in noteLinks" :key="link.id" class="mb-0.5 last:mb-0">
			<a :href="link.url" class="flex bg-gray-700 cursor-pointer" target="_blank" rel="noopener noreferrer nofollow">
				<div
					class="w-16 bg-gray-600 bg-cover bg-center flex-shrink-0"
					:style="generateBannerStyle(link?.banner_url)">
					
				</div>

				<div class="p-3">
					<h4>{{ link.title }}</h4>
					<p class="text-050 uppercase text-gray-500">{{ generateUrlTitle(link.url) }}</p>
				</div>
			</a>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue'
	import { store } from '@/store'

	const props = defineProps({
		noteId: { type: String, required: true },
	})

	const noteLinks = computed(() => store._findLinksByNoteId({ noteId: props.noteId }))

	const generateUrlTitle = ( url ) => {
		try {
			const urlInstance = new URL(url)
			return urlInstance?.host || url
		} catch (error) {
			return url
		}
	}

	const generateBannerStyle = ( banner_url ) => {
		return banner_url 
			? `background-image: url('${ banner_url }')`
			: ''
	}
</script>