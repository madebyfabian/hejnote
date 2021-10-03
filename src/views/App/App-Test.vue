<template>
	<h1>Test</h1>

	<ContextMenuV2>
		<template #button>
			<Button buttonType="primary" is="div">
				Links!
			</Button>
		</template>

		<ContextMenuV2-Item @click="handleClick">
			Test
		</ContextMenuV2-Item>

		<ContextMenuV2-Item @click="handleClick">
			Test2
		</ContextMenuV2-Item>

		<ContextMenuV2-Seperator />

		<ContextMenuV2-Item @click="handleClick">
			Test2...
		</ContextMenuV2-Item>
	</ContextMenuV2>

	<br><br>

	<ContextMenuV2 align="right">
		<template #button>
			<Button buttonType="primary" is="div">
				Rechts!
			</Button>
		</template>

		<ContextMenuV2-Item @click="handleClick">
			Test
		</ContextMenuV2-Item>

		<ContextMenuV2-Item @click="handleClick">
			Test2
		</ContextMenuV2-Item>

		<ContextMenuV2-Seperator />

		<ContextMenuV2-Item @click="handleClick">
			Test2...
		</ContextMenuV2-Item>
	</ContextMenuV2>

	<p class="mt-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores expedita, quisquam distinctio officiis alias reprehenderit minima temporibus est ipsa quae perferendis facilis unde animi saepe ipsum earum qui magnam minus.</p>
</template>

<script setup>
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'
	import ContextMenuV2Seperator from '@/components/ContextMenuV2-Seperator.vue'
	import { Button } from '@/components/ui'

	const handleClick = () => {
		console.log('test');
	}
</script>