<template>
	<button @click="isLoading = !isLoading">Change loading</button>

	<br><br>

	<Button :isLoading="isLoading">
		Test
	</Button>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'

	const isLoading = ref(false)
</script>