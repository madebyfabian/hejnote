<template>
	<h1 class="text-gray-300">Account</h1>
	<button @click="router.push({ name: 'Auth-SignOut' })">Sign out</button>
</template>

<script setup>
	import { useRouter } from 'vue-router'
	const router = useRouter()
</script>