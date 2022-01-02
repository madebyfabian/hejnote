<template>
	<h1>Test</h1>
	<button @click="navigate">navigate</button>
</template>

<script lang="ts" setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'
	import useSupabase from '@/hooks/useSupabase'
	import { definitions } from '@/../types/supabase'
	import useSnackbar from '@/hooks/useSnackbar'
	import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'

	const promiseTimeout = ( ms: number ) => new Promise((resolve) => setTimeout(resolve, ms))
	const route = useRoute()
	const router = useRouter()
	
	const navigate = () => {
		const newRouteObj: RouteLocationRaw = {
			name: 'Home'
		}

		router.push(newRouteObj)
	}
</script>

<style lang="postcss" scoped>
	button {
		@apply bg-green-400 text-gray-1000 rounded-xl p-4 my-4 block;
	}
</style>