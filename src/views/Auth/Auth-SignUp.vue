<template>
	<div class="container">
		<div class="mx-auto max-w-sm mt-14">
			<h1 class="text-center mb-4">Sign up</h1>
			<input class="w-full bg-gray-700 border-none" type="text" v-model="formData.email" placeholder="Email" required>
			<input class="w-full bg-gray-700 border-none" type="password" v-model="formData.password" placeholder="Password" required>

			<button 
				class="text-white bg-gray-700 p-4 w-full mt-4 block" 
				@click="doSignUp">
				
				Sign up
			</button>

			<div v-if="error" class="mt-20 p-8 bg-red-100">{{ error }}</div>
			<div v-if="success" class="mt-20 p-8 bg-green-100">{{ success }}</div>

			<div class="mt-16 text-center">
				Already have an Account?
				<router-link :to="{ name: 'Auth-SignIn' }">Sign in</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import { useRouter } from 'vue-router'
	import useSupabase from '@/hooks/useSupabase'

	const supabase = useSupabase(),
				router = useRouter()

	const formData = reactive({
		email: null as string | null,
		password: null as string | null
	})

	const error = ref(null as any),
				success = ref(null as any)

	const doSignUp = async () => {
		try {
			success.value = false
			error.value = null

			if (typeof formData.email !== 'string' || typeof formData.password !== 'string') 
				throw new Error('email or password not defined')

			// Actually sign in
			const { error: signInError } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password
			})
			if (signInError)
				throw signInError

			// User now will be redirected by global function in App.vue
			
		} catch (err) {
			error.value = (err as Error).message || err as any

		}
	}
</script>

<style lang="postcss" scoped>
	input {
		@apply bg-gray-100 border border-gray-300 p-2 block my-2;
	}
</style>