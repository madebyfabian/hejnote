<template>
	<div class="grid ">
		<div 
			class="item" 
			v-for="note of store.state.notes" 
			:key="note.id"
			:data-deleted-at="note.deleted_at || false"
			:id="note.id">

			<div class="item-content">
				<h1>{{ note.title }}</h1>
				<div style="word-break: break-all;">{{ note.content }}</div>
				<br><br>
				<pre>deleted_at: {{ note.deleted_at }}</pre>
				<button @click="store.notesUpdateSingleDeletedState({ noteId: note.id })">Delete note</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, watch, nextTick, ref } from 'vue'
	import Muuri from 'muuri'
	import { store } from '@/store'

	let	grid
	let lastArray = []
	let filter = '[data-deleted-at=false]'

	watch(store.state.notes, () => {
		grid.synchronize()
		nextTick(() => {
			grid.filter(filter)
		})
	}, { deep: true })

	onMounted(() => {
		// Init grid, with layoutDuration 0 to prevent unnecessary layouting.
		grid = new Muuri('.grid', {
			dragEnabled: true,
			layoutDuration: 0
		})

		// Apply filters.
		grid.filter(filter)

		// After filter is applied, reset the layoutDuration to the default value.
		grid.on('layoutEnd', () => {
			grid._settings.layoutDuration = Muuri.defaultOptions.layoutDuration
		})
		
		
		lastArray = grid.getItems()

		grid.on('dragEnd', async item => {
			let thisArray = grid.getItems()
			
			const updatedItems = thisArray.map(( item, index ) => {
				const itemThisTime = item.getElement(),
							itemLastTime = lastArray[index].getElement()

				const itemOnSamePosition = itemThisTime === itemLastTime
				if (itemOnSamePosition) 
					return

				return { id: itemThisTime.id, sort_key: index }
			}).filter(Boolean)

			store.notesUpsert({ newVals: updatedItems })

			lastArray = thisArray
		})
	})
</script>

<style lang="postcss" scoped>
	.grid {
		position: relative;
	}

	.item {
		--space: 0.75rem;
		display: block;
		position: absolute;
		width: calc(100% / 3 - var(--space) * 2);
		margin: var(--space);
		z-index: 1;
		background: #000;
		color: #fff;

		&.muuri-item-dragging {
			z-index: 3;
		}

		&.muuri-item-releasing {
			z-index: 2;
		}

		&.muuri-item-hidden {
			z-index: 0;
		}

		&-content {
			position: relative;
			width: 100%;
			height: 100%;
		}
	}
</style>