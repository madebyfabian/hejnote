<template>
	<h1>Test</h1>

	<ContextMenu :isOpened="isOpened" @toggleIsOpened="newVal => isOpened = newVal">
		<template #button>
			Open
		</template>

		<li>
			<Cell isClickable @click="handleClick">
				New Car 🚙
			</Cell>
		</li>
		<li>
			<Cell isClickable @click="handleClick">
				<template #icon><IconTrash /></template>
				New Car 🚙
			</Cell>
		</li>

		<li><ContextMenu-Seperator /></li>

		<li>
			<Cell isClickable @click="handleClick">
				Add new Collection...
			</Cell>
		</li>
	</ContextMenu>

	<p>Some other tests</p>
</template>

<script setup>
	import { ref } from 'vue'
	import Cell from '@/components/Cell.vue'
	import ContextMenu from '@/components/ContextMenu.vue'
	import ContextMenuSeperator from '@/components/ContextMenu-Seperator.vue'
	import { IconTrash } from '@/assets/icons'

	const handleClick = () => {
		console.log('clicked');
	}

	const isOpened = ref(false)
</script>