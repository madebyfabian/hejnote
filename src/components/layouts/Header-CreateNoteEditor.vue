<template>
	<div class="container h-11">
		<div class="relative">
			<div 
				class="NoteBar absolute top-0 left-0 w-full bg-gray-800 rounded-xl border border-gray-700 overflow-hidden" 
				:style="{ '--noteBar-max-height': `${ noteBarMaxHeight }px` }"
				:class="{ displayMinimized }"
				@click="handleOpenNoteEditor">

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
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import NoteEditor from '@/components/NoteEditor.vue'

	const displayMinimized = ref(true),
				noteEditorEl = ref(null),
				noteBarMaxHeight = ref(44),
				noteEditorKey = ref(0)

	const toggleDisplayMinimized = (value) => {
		const isMinimized = displayMinimized.value

		// Remount component
		if (!isMinimized)
			noteEditorKey.value++

		noteBarMaxHeight.value = isMinimized ? 167 : noteEditorEl.value.scrollHeight - 1
		displayMinimized.value = value
	}

	const handleOpenNoteEditor = () => {
		if (!displayMinimized.value)
			return

		toggleDisplayMinimized(false)
	}
</script>

<style lang="postcss" scoped>
	.NoteBar {
		@apply max-h-11;

		&:not(.displayMinimized) {
			animation: NoteBar-maximize-height 300ms ease forwards;
		}

		&.displayMinimized {
			animation: NoteBar-minimize-height 300ms ease forwards;
		}
	}

	@keyframes NoteBar-maximize-height {
		0% {
			@apply max-h-11;
		}
		99.9% {
			max-height: var(--noteBar-max-height)
		}
		100% {
			@apply max-h-none;
		}
	}

	@keyframes NoteBar-minimize-height {
		0% {
			min-height: var(--noteBar-max-height)
		}
		100% {
			min-height: 44px;
		}
	}

</style>