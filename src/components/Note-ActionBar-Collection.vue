<template>
	<Badge v-if="collection" class="Note-ActionBar-Collection">
		<span class="max-w-24 overflow-ellipsis overflow-hidden whitespace-nowrap">
			{{ collection.title }}
		</span>

		<button class="Note-ActionBar-Collection-badgeButton" @click="emit('removeCollection')">
			<span 
				aria-hidden="true" 
				class="absolute -left-4 top-0 w-9 h-full bg-gradient-to-r from-transparent via-gray-800 to-gray-800" 
			/>
			<span class="relative">
				<IconClose />
			</span>
		</button>
	</Badge>
</template>

<script setup>
	import { IconClose } from '@/assets/icons'
	import { Badge } from '@/components/ui'

	const emit = defineEmits([ 'removeCollection' ])

	const props = defineProps({
		collection: { required: true, },
	})
</script>

<style lang="postcss" scoped>
	.Note-ActionBar-Collection {
		@apply ml-2 relative;

		&-badgeButton {
			@apply absolute right-1 transition opacity-0 rounded;
		}

		&:hover &-badgeButton,
		&:focus-within &-badgeButton {
			@apply opacity-100;
		}
	}
</style>