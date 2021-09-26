<template>
	<router-view v-slot="{ Component }">
		<transition name="transition-fade-100">
			<div v-if="!generalStore.state.isAppLoading">
				<div class="hidden desktop:block">
					<Header />
				</div>
				
				<div class="mt-4 desktop:mt-24">
					<div class="hidden desktop:block">
						<Sidebar />
					</div>
					<main class="container px-6 desktop:px-10">
						<component :is="Component" />
					</main>
				</div>

				<div class="fixed bottom-0 left-0 w-full desktop:hidden">
					<TabNav />
				</div>
			</div>
		</transition>
	</router-view>
</template>

<script setup>
	import { onMounted } from 'vue'
	import useIsHiddenMode from '@/hooks/useIsHiddenMode'

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
	import TabNav from '@/components/TabNav/TabNav.vue'

	onMounted(async () => {
		const isHiddenMode = useIsHiddenMode()

		// Load all app data
		await Promise.all([
			notesStore.notesFetch({ fetchHidden: isHiddenMode.value }),
			joinNotesLinksStore.joinNotesLinksFetch(),
			collectionsStore.collectionsFetch(),
			linksStore.linksFetch(),
		])

		generalStore.updateIsAppLoading(false)
	})
</script>