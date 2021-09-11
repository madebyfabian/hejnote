<template>
	<CFocusLock>
		<ul
			ref="contentEl" 
			class="
				ContextMenu-Content py-2 rounded-xl bg-gray-800 border border-gray-700 w-[200px] 
				absolute left-0 top-0 z-40
			"
			role="menu"
			aria-haspopup="true"
			:aria-hidden="isOpened ? 'false' : 'true'">

			<slot />
		</ul>
	</CFocusLock>
</template>

<script setup>
	import { onUnmounted, ref } from 'vue'
	import { CFocusLock } from '@chakra-ui/c-focus-lock'

	defineProps({
		isOpened: { type: Boolean, required: true },
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

