<template>
	<div class="NoteEditor z-50 flex-1 h-full" ref="noteEditorEl" v-click-outside="clickOutsideConfig">
		<article 
			class="transition-transform duration-150 flex flex-col flex-1 h-full">

			<input 
				v-model="note.title" type="text" placeholder="New note" :disabled="isLocked"
				class="p-5 pr-20 pb-2 text-150 text-gray-300 font-semibold bg-transparent w-full placeholder-gray-500 outline-none ring-0"
			/>

			<RichtextEditor v-model="note.content" class="flex-1" :isReadonly="isLocked" isInEditMode />

			<div class="px-5 pb-5" v-if="note.id">
				<Note-ActionBar
					:note="note" 
					mode="emitChanges"
					isInEditMode
					@updatedNote="handleActionBarUpdatedNote"
				/>
			</div>

			<div v-if="note.id" class="m-2">
				<Note-LinkList 
					:noteId="note.id" 
					isInEditMode 
					:startWithNewLink="startWithNewLink"
					:isReadonly="isLocked"
				/>
			</div>
		</article>

		<div 
			v-if="!displayInModal"
			class="h-14 flex justify-end pt-0 p-3">

			<Button buttonType="secondary" @click.stop="closeEditor">Close</Button>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, watch, computed, onUnmounted, onUpdated, onBeforeUnmount, nextTick, onMounted } from 'vue'
	import { throttle } from 'throttle-debounce'
	import { joinNotesLinksStore, linksStore, notesStore } from '@/store'
	import { Button, RichtextEditor } from '@/components/ui'
	import { NoteActionBar, NoteLinkList } from '@/components/layouts'
	import { useRoute } from 'vue-router'

	const emit = defineEmits([ 'isFinished' ])

	const props = defineProps({
		note: 							{ type: [ Object ], default: {} },
		displayInModal: 		{ type: Boolean, default: false },	
		startWithNewLink: 	{ type: Boolean, default: false },
	})

	const route = useRoute()

	const noteEditorEl = ref(null)
	const dataChangeWatcherIsActive = ref(true)

	// Setup click outside
	const clickOutsideConfig = {
		events: [ 'mousedown' ],
		handler: () => {
			if (!props.displayInModal) 
				closeEditor()
		}
	}

	// Setup note data
	const note = reactive({ 
		...notesStore.getNoteDefaultDataObject({ note: props.note }) 
	})
	const isLocked = computed(() => note.is_locked)

	// Setup note links
	const noteLinks = computed(() => linksStore._findLinksByNoteIdsV2({ noteIds: [ note.id ] }))
	const lastLinkSet = reactive(new Set(noteLinks.value.map(link => link.url)))
	

	/** 
	 * Methods
	 */
	const _handleDataChange = async ({ updateState = false, forceEvenWithoutChanges = false } = {}) => {
		const data = await notesStore.notesUpsertSingle({ newVal: note, forceEvenWithoutChanges, collectionId: route?.params?.collectionId, updateState })
		if (!note?.id && data?.id)
			note.id = data.id
		updateLinks()
	}

	const _watchDataChangeHandler = () => {
		if (!dataChangeWatcherIsActive.value)
			return

		_handleDataChange()
	}

	// Watch for form data changes
	watch(
		[ note ], 
		throttle(1000, false, _watchDataChangeHandler),
		{ deep: true }
	)

	onMounted(async () => {
		// Start with new link, by first commiting the first change so the note creates itsself in DB.
		dataChangeWatcherIsActive.value = false
		await nextTick()
		await _handleDataChange({ forceEvenWithoutChanges: true })
		await nextTick()
		dataChangeWatcherIsActive.value = true
	})

	// "Start with new link" functionality
	const handleLinkListMounted = async data => {
		if (!props.startWithNewLink)
			return

		data.createLinkModalIsOpened.value = true
	}
	// END "start with new link" functionality

	const prepareEditorClose = () => {
		emit('isFinished')

		// Check if note is completely empty. If so, delete it.
		const isEmpty = notesStore.checkIfNoteIsCompletelyEmpty({ note })
		if (isEmpty)
			notesStore.notesDeleteV2({ noteIds: [ note.id ], notifyUser: false })
		else
			_handleDataChange({ updateState: true })
	}

	const closeEditor = () => {
		prepareEditorClose()
		notesStore.closeNoteEditor()
	}

	const updateLinks = () => {
		// Search for links
		let links = buildSetOfLinks(note.content?.content)

		const newVal = [...links],
					oldVal = [...lastLinkSet]

		const urlsToAdd = newVal.filter(url => !oldVal.includes(url))
		if (urlsToAdd.length) {
			linksStore.linksUpsert({
				linkObjArr: [ ...urlsToAdd.map(url => linksStore.getLinkDefaultDataObject({ link: { url } })) ],
				noteId: note.id,
				joinNotesLinksObj: {
					is_added_from_text: true,
				}
			})
		}

		const urlsNotInTextAnymore = oldVal.filter(url => !newVal.includes(url))
		if (urlsNotInTextAnymore.length) {
			joinNotesLinksStore.joinNotesLinksUpdate({ urlArray: urlsNotInTextAnymore, noteId: note.id, newVal: {
				is_in_text: false
			}})
		}

		lastLinkSet.clear()
		links.forEach(setValue => lastLinkSet.add(setValue))
	}

	const buildSetOfLinks = content => {
		let linkSet = new Set()
		for (const obj of content) {
			if (obj?.type === 'text') {
				const linkMark = obj?.marks?.find(mark => mark?.type === 'link')
				if (linkMark) 
					linkSet.add(linkMark.attrs.href)
			}

			if (obj?.content) 
				buildSetOfLinks(obj?.content).forEach(setValue => linkSet.add(setValue))
		}
		return linkSet
	}

	const handleActionBarUpdatedNote = newVal => {
		// If note is being moved in trash, close the editor and update the note in real store state.
		if (newVal.deleted_at !== undefined) {
			notesStore.notesUpdateSingleDeletedState({ noteId: props.note.id, deleted_at: newVal.deleted_at })
			return closeEditor()
		}

		Object.assign(note, newVal)

		if (newVal.is_archived)
			closeEditor()
	}

	onBeforeUnmount(() => {
		// Give the editor a fixed height so that on modal scroll, it doesn't "jump" away.
		noteEditorEl.value.style.height = `${ noteEditorEl.value?.scrollHeight }px`
	})

	onUnmounted(() => {
		prepareEditorClose()
	})
</script>