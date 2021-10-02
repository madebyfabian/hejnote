<template>
	<h1>Test</h1>

	<button @click="setIsOpen(true)"><b>Open Modal &rarr;</b></button>

	<Dialog :open="isOpen" @close="setIsOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <DialogOverlay class="fixed inset-0 bg-black opacity-30" />

    <div class="bg-gray-800 max-w-lg mx-auto relative z-50">
			<DialogTitle>Deactivate account</DialogTitle>
			<DialogDescription>
				This will permanently deactivate your account
			</DialogDescription>

			<p>
				Are you sure you want to deactivate your account? All of your data will be
				permanently removed. This action cannot be undone.

				<ContextMenuV2>
					<template #button>
						Hej
					</template>

					<ContextMenuV2-Item>
						Lol
					</ContextMenuV2-Item>
				</ContextMenuV2>
			</p>

			<button @click="setIsOpen(false)">Deactivate</button>
			<button @click="setIsOpen(false)">Cancel</button>
		</div>
  </Dialog>

	<p class="mt-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores expedita, quisquam distinctio officiis alias reprehenderit minima temporibus est ipsa quae perferendis facilis unde animi saepe ipsum earum qui magnam minus.</p>
</template>

<script setup>
	import { ref } from 'vue'
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from '@headlessui/vue'
	
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'

	let isOpen = ref(false)

	const setIsOpen = value => {
		isOpen.value = value
	}
</script>