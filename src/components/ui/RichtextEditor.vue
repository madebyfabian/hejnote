<template>
	<FloatingMenu 
		v-if="editor"
		:editor="editor"
		class="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm px-2 py-2 rounded-xl flex gap-4">

		<ButtonIconOnly :icon="IconListUnordered" isInline @click="() => editor.chain().focus().toggleBulletList().run()" >
			Unordered List
		</ButtonIconOnly>
		<ButtonIconOnly :icon="IconListOrdered" isInline @click="() => editor.chain().focus().toggleOrderedList().run()" >
			Ordered List
		</ButtonIconOnly>
		<ButtonIconOnly :icon="IconCheckSquare" isInline @click="() => editor.chain().focus().toggleTaskList().run()" >
			Tesk List
		</ButtonIconOnly>
	</FloatingMenu>

	<EditorContent 
		:editor="editor"
	/>
</template>

<script setup>
	import { watch } from 'vue'
	import { IconListUnordered, IconListOrdered, IconCheckSquare } from '@/assets/icons'
	import { ButtonIconOnly } from '@/components/ui'

	// Import tiptap and tiptap utils.
	import { useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'
	import richtextEditorUtils from '@/utils/richtextEditorUtils'

	const props = defineProps({
		modelValue:	{ type: [ String, Object ], default: '' },
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
		extensions: richtextEditorUtils.extensionList,
	})

	watch(() => props.modelValue, newValue => {
		const isSame = JSON.stringify(editor.value?.getJSON()) === JSON.stringify(newValue)
		if (isSame) 
			return

		editor.value?.commands?.setContent(newValue, false)
	}, { deep: true })
</script>