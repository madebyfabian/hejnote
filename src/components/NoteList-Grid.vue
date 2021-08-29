<template>
	<section class="grid -m-3" :id="id">
		<div 
			class="item" 
			v-for="note of notes" 
			:key="note.id"
			:data-is-pinned="note.is_pinned"
			:data-sort-key="note.sort_key"
			:id="note.id">

			<div class="item-content">
				<Note :note="note" dragHandlerClass="item-dragHandler" />
			</div>
		</div>
	</section>
</template>

<script setup>
	import { onMounted, watch, nextTick, ref } from 'vue'
	import Muuri from 'muuri'
	import { store } from '@/store'
	import Note from '@/components/Note.vue'

	const props = defineProps({
		notes: 				{ type: Array, required: true },
		id: 					{ type: String, required: true },
		showIsPinned: { type: Boolean, default: false },
	})

	let	grid
	let lastArray = []
	let filter = ref(`[data-is-pinned=${ props.showIsPinned }]`)

	watch(() => props.notes, async ( newVal, oldVal ) => {
		await nextTick()

		// Refresh sort data whenever an item's data-foo or data-bar changes
		grid.refreshSortData()
		// Sort the grid by foo and bar.
		grid.sort('sortKey')
		
		grid.refreshItems()
		grid.layout()
		grid.synchronize()

		if (newVal.length > oldVal.length) {
			newVal.forEach(note => {
				if (oldVal.find(oldValNote => oldValNote.id === note.id))
					return false
					
				grid.add(document.getElementById(note.id), {
					index: 0
				})
			})
		}
		
		grid.filter(filter.value)

	}, { deep: true })

	onMounted(() => {
		nextTick(() => {
			// Init grid, with layoutDuration 0 to prevent unnecessary layouting.
			grid = new Muuri(`#${ props.id }`, {
				dragEnabled: true,
				dragHandle: '.item-dragHandler',
				layoutDuration: 0,
				sortData: {
					sortKey: ( item, el ) =>{
						return parseInt(el.getAttribute('data-sort-key'))
					} 
				}
			})

			lastArray = grid.getItems()

			// Apply filters.
			grid.filter(filter.value)
			
			// Sort the grid by foo and bar.
			grid.sort('sortKey')

			// After filter is applied, reset the layoutDuration to the default value.
			grid.on('layoutEnd', () => {
				grid._settings.layoutDuration = Muuri.defaultOptions.layoutDuration
			})

			grid.on('dragEnd', async () => {
				let thisArray = grid.getItems()

				const updatedItems = thisArray.map(( item, index ) => {
					return {
						id: item.getElement().id,
						sort_key: index
					}
				})

				await store.notesUpsert({ newVals: updatedItems })
				
				await nextTick()

				// Refresh sort data whenever an item's data-foo or data-bar changes
				grid.refreshSortData()
				// Sort the grid by foo and bar.
				grid.sort('sortKey')

				grid.refreshItems()
				grid.layout()
				grid.synchronize()

				lastArray = thisArray
			})
		})
	})
</script>

<style lang="postcss" scoped>
	.grid {
		position: relative;

		.item {
			@apply z-1 absolute block;
			--space: 0.75rem;
			width: calc(100% / 3 - var(--space) * 2);
			margin: var(--space);

			&.muuri-item-dragging {
				@apply z-3;

				.Note {
					@apply transform-gpu -rotate-2 scale-105 shadow-border-inset;
				}
			}

			&.muuri-item-releasing {
				@apply z-2;
			}

			&.muuri-item-hidden {
				@apply z-0;
			}

			&-content {
				@apply w-full h-full relative;
			}
		}
	}
</style>