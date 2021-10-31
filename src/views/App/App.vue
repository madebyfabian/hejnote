<template>
	<router-view v-slot="{ Component }">
		<transition name="transition-fade-100">
			<div v-if="!generalStore.state.isAppLoading">
				<BannerHiddenMode :isVisible="isHiddenMode" />

				<Header v-if="!isMobileDevice" class="willMove" :class="{ 'isMoved': isHiddenMode }" />

				<div class="pt-4 desktop:pt-24">
					<Sidebar v-if="!isMobileDevice" class="willMove" :class="{ 'isMoved': isHiddenMode }" />

					<div class="fixed bottom-2 left-2 z-10">
						<SwitchHiddenMode />
					</div>

					<main class="container px-6 pb-24 desktop:pb-0 desktop:px-10 willMove" :class="{ 'isMoved': isHiddenMode }">
						<component :is="Component" />
					</main>
				</div>

				<TabNav v-if="isMobileDevice" :class="{ 'willMove': true, 'isMovedUp': isHiddenMode }" />

				<ModalEditNote />
				<ModalEditNote isCreateAction />
				<ModalUpdateCollections />
			</div>
		</transition>
	</router-view>
</template>

<script setup>
	import { onMounted, computed } from 'vue'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'
	import handleCollectionsChanges from '@/utils/handleCollectionsChanges'
	import { useRoute, useRouter } from 'vue-router'
	import useGenerateRouterLink from '@/hooks/useGenerateRouterLink'

	import { 
		notesStore, 
		generalStore, 
		collectionsStore, 
		linksStore, 
		joinNotesLinksStore 
	} from '@/store'

	const { generateRouterLink } = useGenerateRouterLink()
	const isMobileDevice = useIsMobileDevice()
	const route = useRoute(),
				router = useRouter()
	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)

	// Components
	import { Header, TabNav, Sidebar, BannerHiddenMode, ModalUpdateCollections, ModalEditNote, SwitchHiddenMode } from '@/components/layouts'

	onMounted(async () => {
		// Load all app data
		await Promise.all([
			notesStore.notesFetch({ fetchHidden: isHiddenMode.value }),
			joinNotesLinksStore.joinNotesLinksFetch(),
			collectionsStore.collectionsFetch({ fetchHidden: isHiddenMode.value }),
			linksStore.linksFetch(),
		])

		generalStore.updateIsAppLoading(false)

		handleCollectionsChanges({
			route,

			// Bit hacky, but otherwise the router.replace collides with the router.push from hiddenMode change.
			doRedirect: () => setTimeout(() => {
				router.replace(generateRouterLink({ name: 'App-Home' }).value)
			}, 10),
		})
	})

	
</script>

<style lang="postcss">
	.willMove {
		@apply transition-transform duration-300 transform-gpu;

		&.isMoved {
			@apply desktop:translate-y-8;
		}

		&.isMovedUp {
			@apply -translate-y-10 desktop:-translate-y-0;
		}
	}
</style>