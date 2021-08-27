<template>
	<h1 class="text-gray-300">Account</h1>
	<button @click="signOut">Sign out</button>
</template>

<script setup>
  import useSupabase from '@/hooks/useSupabase'

	const supabase = useSupabase()

	const signOut = async () => {
		await supabase.auth.signOut()
	}
</script>