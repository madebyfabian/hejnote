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
		joinNotesLinksStore 
	} from '@/store'

	// Components
	import Header from '@/components/Header'
	import Sidebar from '@/components/Sidebar'

	onMounted(async () => {
		// Load all app data
		await Promise.all([
			notesStore.notesFetch(),
			joinNotesLinksStore.joinNotesLinksFetch(),
			collectionsStore.collectionsFetch(),
			linksStore.linksFetch(),
		])

		generalStore.updateIsAppLoading(false)
	})
</script>