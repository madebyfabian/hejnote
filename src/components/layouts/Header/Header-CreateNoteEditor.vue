<template>
	<div 
		class="CreateNoteEditor absolute top-0 left-0 w-full bg-gray-800 rounded-xl border border-gray-700 overflow-hidden" 
		:style="{ '--max-height': `${ maxHeight }px` }"
		:class="{ displayMinimized }"
		@click="handleOpen">

		<div class="-m-0.5">
			<div ref="noteEditorEl">
				<NoteEditor 
					@isFinished="() => toggleDisplayMinimized(true)"
					v-bind="{ displayMinimized }"
					:key="noteEditorKey"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { NoteEditor } from '@/components'

	const displayMinimized = ref(true),
				noteEditorEl = ref(null),
				maxHeight = ref(44),
				noteEditorKey = ref(0)

	const toggleDisplayMinimized = (value) => {
		const isMinimized = displayMinimized.value

		// Remount component
		if (!isMinimized)
			noteEditorKey.value++

		maxHeight.value = isMinimized ? 167 : (noteEditorEl?.value?.scrollHeight || 1) - 1
		displayMinimized.value = value
	}

	const handleOpen = () => {
		if (!displayMinimized.value)
			return

		toggleDisplayMinimized(false)
	}
</script>

<style lang="postcss" scoped>
	.CreateNoteEditor {
		@apply max-h-11;

		&:not(.displayMinimized) {
			animation: maximize-height 300ms ease forwards;
		}

		&.displayMinimized {
			animation: minimize-height 300ms ease forwards;
		}
	}

	@keyframes maximize-height {
		0% {
			@apply max-h-11;
		}
		99.9% {
			max-height: var(--max-height)
		}
		100% {
			@apply max-h-none;
		}
	}

	@keyframes minimize-height {
		0% {
			min-height: var(--max-height)
		}
		100% {
			min-height: 44px;
		}
	}

</style>