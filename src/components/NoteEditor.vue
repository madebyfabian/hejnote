<template>
	<div class="NoteEditor z-50" ref="noteEditorEl">
		<article 
			class="transition-transform duration-150" 
			:class="{ 'transform-gpu -translate-y-12 delay-100': displayMinimized }">

			<div class="transition-opacity duration-300 opacity-0" :class="{ 'opacity-100': !displayMinimized }">
				<input 
					v-model="note.title" type="text" placeholder="New note" 
					class="p-5 pr-20 pb-2 text-150 text-gray-300 font-semibold bg-transparent w-full placeholder-gray-500 outline-none ring-0"
				/>
			</div>

			<RichtextEditor v-model="note.content" />

			<div v-if="noteLinks.length" class="m-2">
				<Note-LinkList :noteId="note.id" />
			</div>
		</article>

		<div v-if="!displayInModal" class="h-14">
			<div 
				class="flex justify-end pt-0 p-3 opacity-0 transition transform-gpu" 
				:class="displayMinimized ? 'duration-300 opacity-0 -translate-y-3' : 'duration-500 opacity-100 -translate-y-0'">

				<Button buttonType="secondary" @click="closeEditor">Close</Button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive, watch, computed, onUnmounted, onUpdated, onBeforeUnmount } from 'vue'
	import { throttle } from 'throttle-debounce'
	import { linksStore, notesStore } from '@/store'
	import RichtextEditor from '@/components/RichtextEditor.vue'
	import Button from '@/components/Button.vue'
	import NoteActionBar from '@/components/Note-ActionBar.vue'
	import NoteLinkList from '@/components/Note-LinkList.vue'

	const emit = defineEmits([ 'isFinished' ])

	const props = defineProps({
		note: 						{ type: [ Object ], default: {} },
		displayMinimized: { type: Boolean, default: false },
		displayInModal: 	{ type: Boolean, default: false },	
	})

	// Setup outsideclick
	const noteEditorEl = ref(null)
	let clickEventHandler = e => {
		const clickedOutside = !e.composedPath()?.includes(noteEditorEl.value)
		if (clickedOutside && !props.displayMinimized)
			closeEditor()
	}
	if (!props.displayInModal) 
		document.addEventListener('mousedown', clickEventHandler)

	// Setup note data
	const note = reactive({ 
		...notesStore.getNoteDefaultDataObject({ note: props.note }) 
	})

	// Setup note links
	const noteLinks = computed(() => linksStore._findLinksByNoteId({ noteId: note.id }))
	const lastLinkSet = reactive(new Set(noteLinks.value.map(link => link.url)))
	

	/** 
	 * Methods
	 */
	const _handleDataChange = async ({ updateState = false } = {}) => {
		const data = await notesStore.notesUpsertSingle({ newVal: note, updateState })
		if (!note?.id && data?.id)
			note.id = data.id
		updateLinks()
	}

	// Watch for form data changes
	watch(
		[ note ], 
		throttle(1000, false, _handleDataChange),
		{ deep: true }
	)

	const prepareEditorClose = () => {
		emit('isFinished')
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
			linksStore.linksInsert({ urlArray: urlsToAdd, noteId: note.id })
		}

		const urlsToDelete = oldVal.filter(url => !newVal.includes(url))
		if (urlsToDelete.length) {
			linksStore.linksDeleteV2({ urlArray: urlsToDelete, noteIds: [ note.id ] })
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

	onBeforeUnmount(() => {
		// Give the editor a fixed height so that on modal scroll, it doesn't "jump" away.
		noteEditorEl.value.style.height = `${ noteEditorEl.value?.scrollHeight }px`
	})

	onUnmounted(() => {
		document.removeEventListener('mousedown', clickEventHandler)
		prepareEditorClose()
	})
</script>