<template>
	<div class="Note-Content">
		<div class="Note-Content-inner" :class="{ isReadonly, isInEditMode }">
			<template v-if="!isReadonly">
				<slot />
			</template>

			<div v-else v-html="readonlyContent" />
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'

	// Import tiptap utils.
	import { generateHTML } from '@tiptap/core'
	import richtextEditorUtils from '@/utils/richtextEditorUtils'

	const props = defineProps({
		noteContent:	{ default: undefined },
		isInEditMode: { type: Boolean, default: false }, // meaning: we are inside editor ui and user can edit the content (unless it's locked)
	})

	const isReadonly = computed(() => !!props.noteContent)

	const readonlyContent = computed(() => {
		if (!isReadonly)
			return
			
		return generateHTML(props.noteContent, richtextEditorUtils.extensionList)
	})
</script>

<style lang="postcss" scoped>
	.Note-Content {
		@apply relative;

		:deep(&-inner) {
			.ProseMirror {
        @apply outline-none;
				@apply ring-0;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;

				p.is-editor-empty:first-child::before {
					@apply float-left text-gray-600 pointer-events-none h-0;
					content: attr(data-placeholder);
				}
      }

			&.isInEditMode {
				&:not(.isReadonly) .ProseMirror,
				&.isReadonly {
					@apply p-5 pt-2 pb-7;
				}
			}

      * {
        @apply caret-current;
      }

      ul,
      ol {
        @apply m-0 pl-6;

				&:not(:last-child) {
					@apply pb-2;
				}
      }

      ul {
        &:not([data-type="taskList"]) {
					li {
						@apply relative;

						&::after {
							@apply marker content absolute -left-5 top-2.5;
						}
					}
				}

				&[data-type="taskList"] {
					li {
						@apply flex relative transition-colors duration-100 line-through;
						text-decoration-color: transparent;

						/* after/before is for displaying the checkbox, label is the action in the edit-mode. */
						&::after, &::before, > label {
							@apply absolute -left-6 top-1.5 w-4 h-4 cursor-pointer content;
						}

						&::after, &::before { @apply pointer-events-none; }

						&::after { @apply checkbox; }
						&::before { @apply z-10; }

						> label {
							@apply checkbox-hoverable-el;
							> input { @apply sr-only; }

							&:focus-within {
								@apply mouse-only:outline-none mouse-only:ring-2 mouse-only:ring-green-400;
								@apply mouse-only:transition-shadow mouse-only:duration-100
							}
						}

						&[data-checked="true"] {
							@apply text-gray-500;
							text-decoration-color: theme('colors.gray.500');

							&::after { @apply checkbox-checked; }
							&::before { @apply checkbox-checked-icon; }
						}

						/* content */
						> div { @apply flex-1; }
					}
				}
      }

      ol {
        @apply list-decimal;
      }

      li, p {
        @apply py-1;
      }
			li p {
				@apply p-0;
			}

      hr {
        @apply bg-gray-200 h-0.5 my-2 border-none rounded-sm;
      }

			a {
				@apply break-all underline;
			}

			&.isReadonly a {
				@apply inline-flex items-center overflow-hidden;
				display: -webkit-inline-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				margin-bottom: -5px; /* hacky, but because of -webkit-inline-box */
				max-width: 160px;
			}

			p {
				&:empty:not(:last-child):not(:first-child) {
					@apply h-3
				}
			}
		}
	}
</style>