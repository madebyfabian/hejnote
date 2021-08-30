<template>
	<header class="header flex items-center pt-5 mb-8">
		<router-link 
			:to="{ name: 'App-Home' }" 
			class="flex-1 select-none">

			<img src="@/assets/images/logo.svg" alt="Logo" class="ml-5">
		</router-link>

		<div class="container flex gap-4">
			<div class="flex-1 h-11 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer" @click="isAddNoteModalOpened = true"></div>
		</div>

		<div class="flex-1 flex justify-end items-center select-none">
			<router-link :to="{ name: 'App-Account' }" class="mr-6 flex items-center">
				Hej,&nbsp;
				<span class="font-bold mr-3">{{ userName }}</span>
				<Avatar :name="userName" />
			</router-link>
		</div>
	</header>

	<Modal 
		:isOpened="isAddNoteModalOpened"
		@close="isAddNoteModalOpened = false" 
		:hasPadding="false" 
		title="New note" 
		:displayTitle="false">

		<NoteEditor 
			@isFinished="isAddNoteModalOpened = false" 
		/>
	</Modal>

	<Modal 
		:isOpened="generalStore.state.editNoteModalVisible" 
		@close="() => generalStore.closeNoteEditor()" 
		:hasPadding="false" 
		title="Edit note" 
		:displayTitle="false">

		<NoteEditor 
			@isFinished="() => generalStore.closeNoteEditor()" 
			:note="editNote" 
		/>
	</Modal>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { notesStore } from '@/store/notesStore'
	import { generalStore } from '@/store/generalStore'

	// Import Components
	import Avatar from '@/components/Avatar.vue'
	import Modal from '@/components/Modal.vue'
	import NoteEditor from '@/components/NoteEditor.vue'

	const isAddNoteModalOpened = ref(false)

	const userName = computed(() => {
		return generalStore.state.user?.user_metadata?.name || generalStore.state.user?.email;
	})

	const editNote = computed(() => {
		return notesStore.notesFilter({ noteId: generalStore.state.editNoteId })
	})
</script>