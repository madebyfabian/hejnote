<template>
	<Header isMinimal />

	<div class="container">
		<div class="mx-auto max-w-sm mt-16 rounded-2xl bg-gray-900 divide-y-4 divide-gray-1000">
			<div class="flex flex-col gap-8 p-8">
				<div class="text-center">
					<h1 class="mb-1">Welcome back 👋🏻</h1>
					<p>We love to have you here!</p>
				</div>

				<div v-if="errorMsg" class="text-red-300 text-center font-bold">{{ errorMsg }}</div>

				<form @submit.prevent="doAuthenticate">
					<TextInput v-model="formData.email" :inputProps="{ type: 'email', placeholder: 'hej@your.email', required: true }" class="mb-4" />
					<TextInput v-model="formData.password" :inputProps="{ type: 'password', placeholder: 'Your Secret (Password)', required: true }" class="mb-6" />

					<Button isFullWidth type="submit">
						<span>🚀</span>
						Sign in
					</Button>
				</form>
			</div>

			<div class="p-8">
				<Button buttonType="secondary" isFullWidth type="submit" @click="() => doAuthenticate({ provider: 'github' })">
					<IconGitHub />
					Sign in with GitHub
				</Button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import { useRouter } from 'vue-router'
	import useSupabase from '@/hooks/useSupabase'

	import { IconGitHub } from '@/assets/icons'
	import { Button, TextInput } from '@/components/ui'
	import { Header } from '@/components/layouts'

	const supabase = useSupabase(),
				router = useRouter()

	const formData = reactive({
		email: '',
		password: ''
	})

	const errorMsg = ref(null as string | null)

	enum Provider { GITHUB = 'github' }

	const doAuthenticate = async ({ provider = undefined }: { provider: Provider | undefined }) => {
		try {
			errorMsg.value = null

			switch (provider) {
				case 'github': {
					// Actually sign in
					const { user, session, error } = await supabase.auth.signIn({ provider: 'github' })
					if (error) throw error

					break
				}

				default: {
					if (!formData.email || !formData.password)
					throw new Error('email or password not defined')

					// Actually sign in
					const { error } = await supabase.auth.signIn({
						email: formData.email,
						password: formData.password
					})
					if (error) throw error

					break
				}
			}

			// User now will be redirected by global function in App.vue
			
		} catch (error) {
			errorMsg.value = (error as Error).message || error as any

		}
	}
</script>