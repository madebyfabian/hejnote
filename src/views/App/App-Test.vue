<template>
	<h1>Test</h1>
	<button @click="getData">fire getData()</button>
	<button @click="openSnackbar">open Snackbar</button>
</template>

<script lang="ts" setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'
	import useSupabase from '@/hooks/useSupabase'
	import { definitions } from '@/../types/supabase'
	import useSnackbar from '@/hooks/useSnackbar'

	const promiseTimeout = ( ms: number ) => new Promise((resolve) => setTimeout(resolve, ms))
	
	const getData = async () => {
		const { data, error } = await useSupabase()
			.from<definitions['notes']>('notes')
			.select('*')

		if (error || !data?.length)
			return

		const newObject: definitions['notes'] = {
      id: data[0].id,
      owner_id: '',
      created_at: '',
      updated_at: '',
      is_pinned: false,
      content: '',
      is_hidden: false,
      is_archived: false,
      is_locked: false
    }
	}

	const openSnackbar = () => {
		useSnackbar().createSnackbar({ message: 'test', timeout: 9999999, buttonText: 'haha' })
	}
</script>

<style lang="postcss" scoped>
	button {
		@apply bg-green-400 text-gray-1000 rounded-xl p-4 my-4 block;
	}
</style>