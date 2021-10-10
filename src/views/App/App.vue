<template>
	<router-view v-slot="{ Component }">
		<transition name="transition-fade-100">
			<div v-if="!generalStore.state.isAppLoading">
				<BannerHiddenMode :isVisible="isHiddenMode" />

				<Header v-if="!isMobileDevice" class="willMoveDown" :class="{ 'movedDown': isHiddenMode }" />

				<div class="pt-4 desktop:pt-24">
					<Sidebar v-if="!isMobileDevice" class="willMoveDown" :class="{ 'movedDown': isHiddenMode }" />

					<div class="fixed bottom-2 left-2 z-10">
						<SwitchHiddenMode />
					</div>

					<main class="container px-6 pb-24 desktop:pb-0 desktop:px-10 willMoveDown" :class="{ 'movedDown': isHiddenMode }">
						<component :is="Component" />
					</main>
				</div>

				<TabNav v-if="isMobileDevice" />

				<!-- Edit note modal -->
				<Modal 
					:isOpened="notesStore.state.editNoteModalVisible" 
					:hasPadding="false" 
					:displayTitle="false"
					@close="() => notesStore.closeNoteEditor()"
					title="Edit note"
					forceMobileFullHeight>

					<NoteEditor 
						displayInModal
						:note="editNote" 
					/>
				</Modal>

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
	import Header from '@/components/Header'
	import { Sidebar } from '@/components/Sidebar'
	import { TabNav } from '@/components/TabNav'
	import { Modal } from '@/components/ui'
	import NoteEditor from '@/components/NoteEditor.vue'
	import SwitchHiddenMode from '@/components/SwitchHiddenMode.vue'
	import { BannerHiddenMode, ModalUpdateCollections } from '@/components/layouts'

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

	const editNote = computed(() => {
		return notesStore.noteFindById({ noteId: notesStore.state.editNoteId })
	})
</script>

<style lang="postcss" scoped>
	.willMoveDown {
		@apply transition-transform duration-300 transform-gpu;

		&.movedDown {
			@apply translate-y-16 desktop:translate-y-8;
		}
	}
</style>