import { generateText as _generateText } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import { TaskItem } from '@/plugins/TipTapExtensionTaskItem.ts'
import Link from '@tiptap/extension-link'
import FloatingMenu from '@tiptap/extension-floating-menu'


/**
 * List of all used extensions
 */
export const extensionList = [
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
	FloatingMenu,
]


/**
 * Generate text from a rich text doc JSON object.
 */
export const generateText = async ({ doc } = {}) => {
	return _generateText(doc, extensionList)
}


export default {
	generateText,
	extensionList
}