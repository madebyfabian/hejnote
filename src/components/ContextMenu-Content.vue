<template>
	<CFocusLock>
		<ul
			ref="contentEl" 
			role="menu"
			class="
				ContextMenu-Content py-2 rounded-xl bg-gray-800 border border-gray-700 min-w-[200px] 
				absolute top-1 z-40
			"
			:class="{ 
				'left-0': align === 'left', 
				'right-0': align === 'right' 
			}"
			:id="id"
			:aria-hidden="isOpened ? 'false' : 'true'">

			<slot />
		</ul>
	</CFocusLock>
</template>

<script setup>
	import { onUnmounted, ref } from 'vue'
	import { CFocusLock } from '@chakra-ui/c-focus-lock'

	defineProps({
		// Inherit from parent props
		isOpened: { type: Boolean, required: true },
		align: 		{ type: String },

		// Own props
		id: 			{ type: String, required: true },
	})
	const emit = defineEmits([ 'toggleIsOpened' ])

	const contentEl = ref(null)

	const handler = (e) => {
		if (e.key.toUpperCase() === 'ESCAPE')
			emit('toggleIsOpened', false)
	}

	document.addEventListener('keydown', handler)
	onUnmounted(() => {
		document.removeEventListener('keydown', handler)
	})
</script>

<style lang="postcss" scoped>
	/** Transition */
	.transition-contextMenu-enter-active {
		@apply transition duration-150;
	}
	.transition-contextMenu-leave-active {
		@apply transition duration-100;
	}
	.transition-contextMenu-enter-from, 
	.transition-contextMenu-leave-to {
		@apply opacity-0;
	}
</style>

