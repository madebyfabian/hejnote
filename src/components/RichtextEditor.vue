<template>
  <div class="RichtextEditor">
		<div class="RichtextEditor-content">
			<editor-content v-if="!isReadonly" :editor="editor" />
			<div v-else v-html="readonlyHTML" />
		</div>
	</div>
</template>

<script setup>
	import { computed, watch } from 'vue'
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
		modelValue:	{ type: [ String, Object ], default: '' },
		isReadonly:	{ type: Boolean, default: false },
	})

	const emit = defineEmits([ 'update:modelValue' ])

	const editor = useEditor({
		content: props.modelValue,
		onUpdate: () => {
			emit('update:modelValue', editor.value.getJSON())
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

	const readonlyHTML = computed(() => {
		return editor?.value?.getHTML() || ''
	})

	watch(() => props.modelValue, newValue => {
		const isSame = JSON.stringify(editor.value?.getJSON()) === JSON.stringify(newValue)
		if (isSame) 
			return

		editor.value?.commands?.setContent(newValue, false)
	}, { deep: true })
</script>

<style lang="postcss" scoped>
	.RichtextEditor {
		@apply relative;

		:deep(&-content) {
			.ProseMirror {
        @apply p-5 pt-2 pb-7 outline-none;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;

				p.is-editor-empty:first-child::before {
					@apply float-left text-gray-500 pointer-events-none h-0;
					content: attr(data-placeholder);
				}
      }

      * {
        @apply caret-current;
      }

      ul,
      ol {
        @apply m-0 pl-6 pb-2;
      }

      ul {
        @apply list-disc;

				&[data-type="taskList"] {
					li {
						@apply flex relative transition-colors duration-100 line-through;
						text-decoration-color: transparent;

						/* after/before is for displaying the checkbox, label is the action in the edit-mode. */
						&::after, &::before, > label {
							@apply absolute -left-6 top-1.5 w-4 h-4 cursor-pointer;
							content: '';
						}

						&::after, &::before { @apply pointer-events-none; }

						&::after { @apply checkbox; }
						&::before { @apply z-10; }

						> label {
							@apply checkbox-hoverable-el;
							> input { @apply sr-only; }
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
			
			p {
				&:empty:not(:last-child):not(:first-child) {
					@apply h-3
				}
			}
		}
	}
</style>