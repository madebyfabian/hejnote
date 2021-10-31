<template>
	<h1>
		Test
	</h1>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'

	const promiseTimeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
</script>

<style lang="postcss" scoped>
	
</style>