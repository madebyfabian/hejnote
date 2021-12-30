<template>
	<h1>Test</h1>
	<button @click="getData">fire getData()</button>
</template>

<script lang="ts" setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'
	import useSupabase from '@/hooks/useSupabase'
	import { definitions } from '@/../types/supabase'

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
</script>