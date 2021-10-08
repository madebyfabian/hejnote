<template>
	<div class="-mx-4">
		<h1 class="mx-4 mb-4">More</h1>
		<Cell isTypeNavigation :navigateTo="{ name: 'App-Archive' }" dividerInset>
			<template #icon>
				<IconArchive />
			</template>
			Archive
		</Cell>

		<Cell isTypeNavigation :navigateTo="{ name: 'App-Deleted' }" dividerInset>
			<template #icon>
				<IconTrash />
			</template>
			Trash
		</Cell>
	</div>
	
</template>

<script setup>
	import { Cell } from '@/components/ui'
	import { IconArchive, IconTrash, IconMoreSolid } from '@/assets/icons'
</script>