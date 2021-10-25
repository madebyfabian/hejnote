<template>
  <div class="RichtextEditor">
		<div class="RichtextEditor-content" :class="{ isReadonly, isInEditMode }">
			<EditorContent v-if="!isReadonly" :editor="editor" />
			<div v-else v-html="readonlyHTML" />
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref, watch } from 'vue'

	// Import tiptap and tiptap utils.
	import { useEditor, EditorContent } from '@tiptap/vue-3'
	import StarterKit from '@tiptap/starter-kit'
	import ListItem from '@tiptap/extension-list-item'
	import BulletList from '@tiptap/extension-bullet-list'
	import OrderedList from '@tiptap/extension-ordered-list'
	import Placeholder from '@tiptap/extension-placeholder'
	import TaskList from '@tiptap/extension-task-list'
	import TaskItem from '@tiptap/extension-task-item'
	import Link from '@tiptap/extension-link'

	const props = defineProps({
		modelValue:		{ type: [ String, Object ], default: '' },
		isReadonly:		{ type: Boolean, default: false },
		isInEditMode: { type: Boolean, default: false }, // meaning: we are inside editor ui and user can edit the content (unless it's locked)
	})

	const emit = defineEmits([ 'update:modelValue', 'editorCreated' ])

	const editor = useEditor({
		content: props.modelValue,
		onUpdate: () => {
			emit('update:modelValue', editor.value.getJSON())
		},
		onCreate: () => {
			emit('editorCreated')
		},
		extensions: [
			StarterKit,
			ListItem,
			BulletList,
			OrderedList,
			Placeholder.configure({
				placeholder: 'Write something...',
			}),
			Link.configure({
				openOnClick: false
			}),
			TaskList,
			TaskItem,
		]
	})

	watch(() => props.modelValue, newValue => {
		const isSame = JSON.stringify(editor.value?.getJSON()) === JSON.stringify(newValue)
		if (isSame) 
			return

		editor.value?.commands?.setContent(newValue, false)
	}, { deep: true })


	/**
	 * Generates the HTML for the readonly editor.
	 */
	const readonlyHTML = ref('')
	const generateReadonlyHTML = () => {
		if (!props.isReadonly || !editor?.value)
			return ''

		// Then, transform the data to HTML*/
		const html = editor.value.getHTML()

		readonlyHTML.value = html
	}

	// On first mount, run the readonly html generator.
	onMounted(() => {
		generateReadonlyHTML()
	})

	// After the props have been updated, regenerate the readonly html.
	watch(() => props, () => {
		generateReadonlyHTML()
	}, { deep: true })
</script>

<style lang="postcss" scoped>
	.RichtextEditor {
		@apply relative;

		:deep(&-content) {
			.ProseMirror {
        @apply outline-none;
				@apply ring-0;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;

				p.is-editor-empty:first-child::before {
					@apply float-left text-gray-500 pointer-events-none h-0;
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