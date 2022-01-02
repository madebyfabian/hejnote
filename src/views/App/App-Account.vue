<template>
	<h1 class="text-gray-300 mb-4">Hej, {{ userName }}!</h1>
	<Button @click="router.push({ name: 'Auth-SignOut' })">Sign out</Button>
</template>

<script lang="ts" setup>
	import { computed } from 'vue'
	import { useRouter } from 'vue-router'
	import { Button } from '@/components/ui'
	import { generalStore } from '@/store'

	const userName = computed(() => generalStore.getUserName())
	const router = useRouter()
</script>