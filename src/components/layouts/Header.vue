<template>
	<header class="header flex items-center pt-5 mb-8">
		<router-link 
			:to="{ name: 'App-Home' }" 
			class="flex-1 select-none">

			<img src="@/assets/images/logo.svg" alt="Logo" class="ml-5">
		</router-link>

		<Header-CreateNoteEditor />

		<div class="flex-1 flex justify-end items-center select-none">
			<router-link :to="{ name: 'App-Account' }" class="mr-6 flex items-center">
				Hej,&nbsp;
				<span class="font-bold mr-3">{{ userName }}</span>
				<Avatar :name="userName" />
			</router-link>
		</div>
	</header>

	<Modal 
		:isOpened="generalStore.state.editNoteModalVisible" 
		@close="() => generalStore.closeNoteEditor()" 
		:hasPadding="false" 
		title="Edit note" 
		:displayTitle="false">

		<NoteEditor 
			displayInModal
			@isFinished="() => generalStore.closeNoteEditor()" 
			:note="editNote" 
		/>
	</Modal>
</template>

<script setup>
	import { computed } from 'vue'
	import { notesStore, generalStore } from '@/store'

	// Import Components
	import Avatar from '@/components/Avatar.vue'
	import Modal from '@/components/Modal.vue'
	import NoteEditor from '@/components/NoteEditor.vue'
	import HeaderCreateNoteEditor from '@/components/layouts/Header-CreateNoteEditor.vue'

	const userName = computed(() => {
		return generalStore.state.user?.user_metadata?.name || generalStore.state.user?.email;
	})

	const editNote = computed(() => {
		return notesStore.notesFilter({ noteId: generalStore.state.editNoteId })
	})
</script>

