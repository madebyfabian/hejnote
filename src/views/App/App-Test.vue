<template>
	<div id="content">
		<h1>Lorem ipsum</h1>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas provident ullam natus blanditiis corporis? Tempora eum voluptatibus, deserunt minima tenetur exercitationem et deleniti cupiditate ratione unde sit architecto totam beatae!
		</p>
	</div>

	<br><br>


	<Button @click="isModalOpened = true">open modal</Button>

	<br><br>

	<pre>isModalOpened: {{ isModalOpened }}</pre>

	<ModalV3 :isOpened="isModalOpened" @close="isModalOpened = false" />
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import ModalV2 from '@/components/ui/ModalV2.vue'
	import ModalV3 from '@/components/ui/ModalV3.vue'

	const isModalOpened = ref(false)
</script>