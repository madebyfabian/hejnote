<template>
	<router-view v-slot="{ Component }">
		<transition name="transition-fade-100">
			<div v-if="!generalStore.state.isAppLoading">
				<Header />
				
				<div class="mt-24">
					<Sidebar />
					<main class="container">
						<component :is="Component" />
					</main>
				</div>
			</div>
		</transition>
	</router-view>
</template>

<script setup>
	import { onMounted } from 'vue'

	import { 
		notesStore, 
		generalStore, 
		collectionsStore, 
		linksStore, 
		joinNotesCollectionsStore, 
		joinNotesLinksStore 
	} from '@/store'

	// Components
	import Header from '@/components/layouts/Header.vue'
	import Sidebar from '@/components/layouts/Sidebar.vue'

	onMounted(async () => {
		// Load all app data
		await Promise.all([
			notesStore.notesFetch(),
			joinNotesCollectionsStore.joinNotesCollectionsFetch(),
			joinNotesLinksStore.joinNotesLinksFetch(),
			collectionsStore.collectionsFetch(),
			linksStore.linksFetch(),
		])

		generalStore.updateIsAppLoading(false)
	})
</script>