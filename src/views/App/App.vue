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
					title="Edit note">

					<NoteEditor 
						displayInModal
						:note="editNote" 
					/>
				</Modal>
			</div>
		</transition>
	</router-view>
</template>

<script setup>
	import { onMounted, computed } from 'vue'
	import useIsMobileDevice from '@/hooks/useIsMobileDevice'

	import { 
		notesStore, 
		generalStore, 
		collectionsStore, 
		linksStore, 
		joinNotesLinksStore 
	} from '@/store'

	const isMobileDevice = useIsMobileDevice()
	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)

	// Components
	import Header from '@/components/Header'
	import Sidebar from '@/components/Sidebar'
	import TabNav from '@/components/TabNav/TabNav.vue'
	import Modal from '@/components/Modal.vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import BannerHiddenMode from '@/components/BannerHiddenMode.vue'
	import SwitchHiddenMode from '@/components/SwitchHiddenMode.vue'

	onMounted(async () => {
		// Load all app data
		await Promise.all([
			notesStore.notesFetch({ fetchHidden: isHiddenMode.value }),
			joinNotesLinksStore.joinNotesLinksFetch(),
			collectionsStore.collectionsFetch(),
			linksStore.linksFetch(),
		])

		generalStore.updateIsAppLoading(false)
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