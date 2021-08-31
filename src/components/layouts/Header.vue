<template>
	<header class="header flex items-center pt-5 mb-8">
		<router-link 
			:to="{ name: 'App-Home' }" 
			class="flex-1 select-none">

			<img src="@/assets/images/logo.svg" alt="Logo" class="ml-5">
		</router-link>

		<div class="container h-11">
			<div class="relative">
				<div 
					class="NoteBar absolute top-0 left-0 w-full bg-gray-800 rounded-xl border border-gray-700 overflow-hidden" 
					:style="{ '--noteBar-max-height': `${ noteBarMaxHeight }px` }"
					:class="{ displayMinimized }">

					<div class="-m-0.5">
						<div ref="noteEditorEl">
							<NoteEditor 
								@editorFocus="() => toggleDisplayMinimized(false)"
								@isFinished="() => toggleDisplayMinimized(true)"
								v-bind="{ displayMinimized }"
							/>
						</div>
					</div>
				</div>
			</div>
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
			displayInModal
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
			displayInModal
			@isFinished="() => generalStore.closeNoteEditor()" 
			:note="editNote" 
		/>
	</Modal>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { notesStore, generalStore } from '@/store'

	// Import Components
	import Avatar from '@/components/Avatar.vue'
	import Modal from '@/components/Modal.vue'
	import NoteEditor from '@/components/NoteEditor.vue'

	const isAddNoteModalOpened = ref(false),
				displayMinimized = ref(true),
				noteEditorEl = ref(null),
				noteBarMaxHeight = ref(44)

	const userName = computed(() => {
		return generalStore.state.user?.user_metadata?.name || generalStore.state.user?.email;
	})

	const editNote = computed(() => {
		return notesStore.notesFilter({ noteId: generalStore.state.editNoteId })
	})

	const toggleDisplayMinimized = (value) => {
		const isMinimized = displayMinimized.value
		noteBarMaxHeight.value = isMinimized ? 167 : noteEditorEl.value.scrollHeight - 1
		displayMinimized.value = value
	}
</script>

<style lang="postcss" scoped>
	.NoteBar {
		@apply max-h-11;

		&:not(.displayMinimized) {
			animation: NoteBar-maximize-height 300ms ease forwards;
		}

		&.displayMinimized {
			animation: NoteBar-minimize-height 300ms ease forwards;
		}
	}

	@keyframes NoteBar-maximize-height {
		0% {
			@apply max-h-11;
		}
		99.9% {
			max-height: var(--noteBar-max-height)
		}
		100% {
			@apply max-h-none;
		}
	}

	@keyframes NoteBar-minimize-height {
		0% {
			min-height: var(--noteBar-max-height)
		}
		100% {
			min-height: 44px;
		}
	}

</style>