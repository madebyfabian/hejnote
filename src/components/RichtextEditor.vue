<template>
  <div class="RichtextEditor">
		<div class="RichtextEditor-content">
			<EditorContent v-if="!isReadonly" :editor="editor" />
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
	import Link from '@tiptap/extension-link'

	const props = defineProps({
		modelValue: { type: [ String, Object ], default: '' },
		isReadonly: { type: Boolean, default: false },
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
			})
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
			[contenteditable] {
        @apply p-6 pt-2 pb-8 outline-none;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
      }

			.ProseMirror p.is-editor-empty:first-child::before {
				@apply float-left text-gray-500 pointer-events-none h-0;
				content: attr(data-placeholder);
			}

      * {
        @apply caret-current;
      }

      ul,
      ol {
        @apply m-0 pl-4;
      }

      ul {
        @apply list-disc;
      }

      ol {
        @apply list-decimal;
      }

      li > p,
      li > ol,
      li > ul {
        @apply my-0.5;
      }

      hr {
        @apply bg-gray-200 h-0.5 my-2 border-none rounded-sm;
      }

			a {
				@apply break-all underline;
			}
			
			p {
				&:empty {
					@apply h-3
				}
			}
		}
	}
</style>