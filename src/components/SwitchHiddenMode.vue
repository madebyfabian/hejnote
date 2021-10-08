<template>
	<Switch
		:value="isHiddenMode" 
		@change="handleSwitchHiddenMode"
		label="Hidden mode" 
	/>
</template>

<script setup>
	import { computed } from 'vue'
	import { generalStore } from '@/store'
	import { useRoute, useRouter } from 'vue-router'
	import { Switch } from '@/components/ui'

	const route = useRoute()
	const router = useRouter()	

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)

	const handleSwitchHiddenMode = () => {
		return router.push({ 
			name: route.name,
			query: route.query,
			hash: route.hash,
			params: {
				...route.params, 
				isHiddenMode: isHiddenMode.value ? null : 'hidden' 
			} 
		})
	}
</script>