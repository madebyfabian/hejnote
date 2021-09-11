<template>
	<div class="container select-none">
		<div class="flex items-center flex-col">
			<h1 class="mt-36">404</h1>
			<p class="mb-8">Page not found</p>
			<Button @click="router.push({ name: 'App-Home' })" buttonType="secondary">Back to Home</Button>
		</div>
	</div>
</template>

<script setup>
	import { useRouter } from 'vue-router'
	const router = useRouter()

	import { Button } from '@/components/ui'
</script>