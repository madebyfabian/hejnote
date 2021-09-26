<template>
	<header class="Header">
		<AppLink :to="{ name: 'App-Home' }" class="flex-1 select-none">
			<LogoIcon alt="Logo" class="ml-5" />
		</AppLink>

		<div class="flex container h-11">
			<div class="relative flex-1">
				<transition name="transition-fade-100">
					<Header-CreateNoteEditor v-show="!isSearchFocussed" />
				</transition>
				<div class="Header-bgGradient isTop"></div>
				<div class="Header-bgGradient isBottom"></div>
			</div>
		  <div class="ml-4">
				<Header-SearchNotesBar v-bind="{ isSearchFocussed }" />
			</div>
		</div>

		<div class="flex-1 flex justify-end items-center select-none">
			<AppLink :to="{ name: 'App-Account' }" class="mr-6 flex items-center">
				Hej,&nbsp;
				<span class="font-bold mr-3">{{ userName }}</span>
				<Avatar :name="userName" />
			</AppLink>
		</div>
	</header>

	<Modal 
		:isOpened="notesStore.state.editNoteModalVisible" 
		:hasPadding="false" 
		:displayTitle="false"
		@close="() => notesStore.closeNoteEditor()"
		title="Edit note" >

		<NoteEditor 
			displayInModal
			:note="editNote" 
		/>
	</Modal>
</template>

<script setup>
	import { computed } from 'vue'
	import { notesStore, generalStore } from '@/store'
	import { useRoute } from 'vue-router'
	import LogoIcon from '@/assets/images/logo.svg'

	// Import Components
	import { AppLink, Avatar } from '@/components/ui'
	import Modal from '@/components/Modal.vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import { HeaderCreateNoteEditor, HeaderSearchNotesBar } from '@/components/Header'

	const userName = computed(() => {
		return generalStore.state.user?.user_metadata?.name || generalStore.state.user?.email;
	})

	const editNote = computed(() => {
		return notesStore.noteFindById({ noteId: notesStore.state.editNoteId })
	})

	const route = useRoute()
	const isSearchFocussed = computed(() => route.name === 'App-Search')
</script>

<style lang="postcss" scoped>
	.Header {
		@apply fixed top-0 left-0 w-full z-40 flex items-center pt-5;

		&-bgGradient {
			@apply absolute left-0 w-full -z-1 pointer-events-none;

			&.isTop {
				@apply -top-5 h-8 backdrop-blur-xl bg-gray-900 bg-opacity-75;
			}

			&.isBottom {
				@apply top-8 h-10 bg-gradient-to-b from-gray-900 to-transparent;
			}
		}
	}
</style>
