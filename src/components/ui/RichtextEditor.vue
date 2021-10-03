<template>
  <div class="RichtextEditor" ref="richtextEditorEl">
		<div class="RichtextEditor-content" :class="{ isReadonly }">
			<editor-content v-if="!isReadonly" :editor="editor" />
			<div v-else v-html="readonlyHTML" />
		</div>
	</div>
</template>

<script setup>
	import { computed, ref, watch } from 'vue'
	import useGetUrlHost from '@/hooks/useGetUrlHost'

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
		modelValue:	{ type: [ String, Object ], default: '' },
		isReadonly:	{ type: Boolean, default: false },
	})

	const emit = defineEmits([ 'update:modelValue', 'editorCreated' ])

	const richtextEditorEl = ref(null)

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

	const _replaceLinkTextWithHost = data => {
		data.content = data.content.map(obj => {
			if (obj?.type === 'text') {
				const linkMarkIndex = obj?.marks?.findIndex(mark => mark?.type === 'link')
				if (linkMarkIndex > -1) 
					obj.text = useGetUrlHost(obj?.marks?.[0]?.attrs?.href)
			}

			return obj?.content ? _replaceLinkTextWithHost(obj) : obj
		})
		return data
	}

	const readonlyHTML = computed(() => {
		if (!editor?.value)
			return ''

		// First, transform links
		const data = editor.value.getJSON()
		const transformedData = _replaceLinkTextWithHost(data)

		// Then, update the content of the readonly editor.
		editor.value.commands.setContent(transformedData)

		// Then, transform the data to HTML
		const html = editor.value.getHTML()

		return html
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
				@apply ring-0;
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
			
			p {
				&:empty:not(:last-child):not(:first-child) {
					@apply h-3
				}
			}

			&.isReadonly {
				a {
					@apply inline-flex items-center bg-gray-700 px-1.5 rounded-lg no-underline text-050 max-h-5 overflow-hidden;
					@apply -mt-1 transform translate-y-1;

					&::before {
						@apply content block flex-shrink-0 h-4 w-4 -ml-0.5 mr-0.5;
						@apply icon-link;
					}
				}
			}
		}
	}
</style>