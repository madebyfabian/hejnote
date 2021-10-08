<template>
	<div class="bg-gray-800 my-4 py-4">
		<Cell>
			<template #icon>
				<IconArchive />
			</template>
			This is some Cell content<br>
			Multiple lines
			<template #iconRight>
				<IconChevron />
			</template>
		</Cell>

		<Cell>
			<template #icon>
				<IconArchive />
			</template>
			This is some Cell content
		</Cell>

		<br><br><br>

		<Cell isSelected>
			This is some Cell content<br>
			Multiple lines
		</Cell>

		<Cell>
			This is some Cell content
		</Cell>

		<br><br><br>
		<Cell dividerInset isClickable isTypeNavigation>
			This is some Cell content
		</Cell>
		<Cell dividerInset isClickable isTypeNavigation>
			This is some Cell content
		</Cell>
	</div>
</template>

<script setup>
	import { Cell } from '@/components/ui'
	import { IconArchive, IconChevron } from '@/assets/icons'
</script>