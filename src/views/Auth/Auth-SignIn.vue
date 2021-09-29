<template>
	<HeaderMinimal />
	<div class="container">
		<div class="mx-auto max-w-sm mt-16 rounded-2xl bg-gray-800 p-8 flex flex-col gap-8">
			<div class="text-center">
				<h1 class="mb-1">Welcome back 👋🏻</h1>
				<p>We love to have you here!</p>
			</div>

			<div v-if="errorMsg" class="text-red-300 text-center font-bold">{{ errorMsg }}</div>

			<form @submit.prevent="doAuthenticate">
				<TextInput v-model="formData.email" type="email" placeholder="hej@your.email" required class="mb-4" />
				<TextInput v-model="formData.password" type="password" placeholder="Your Secret (Password)" required class="mb-6" />

				<Button isFullWidth type="submit">Sign in 🚀</Button>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import { useRouter } from 'vue-router'
	import useSupabase from '@/hooks/useSupabase'

	import { Button, TextInput } from '@/components/ui'
	import { HeaderMinimal } from '@/components/Header'

	const supabase = useSupabase(),
				router = useRouter()

	const formData = reactive({
		email: 'x@y.de',
		password: 'test'
	})

	const errorMsg = ref(null)

	const _signIn = () => {
		return supabase.auth.signIn({
			email: formData.email,
			password: formData.password
		})
	}

	const doAuthenticate = async () => {
		try {
			errorMsg.value = null

			if (!formData.email || !formData.password)
				throw new Error('email or password not defined')

			// Actually sign in
			const { data: signInUser, error: signInError } = await _signIn()
			if (signInError)
				throw signInError

			// User now will be redirected by global function in App.vue
			
		} catch (error) {
			errorMsg.value = error?.message || error

		}
	}
</script>