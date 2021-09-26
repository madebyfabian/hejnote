<template>
	<div class="LandingPage py-11 desktop:py-14 flex flex-col items-start desktop:items-center min-h-screen font-landingPage text-gray-100 overflow-hidden">
		<LogoIcon alt="Logo" class="h-7 w-auto relative z-10 mx-11" />

		<div class="container relative flex-1 flex flex-col desktop:flex-row desktop:justify-between my-14">
			<IllustrationLandingPage class="max-w-full desktop:w-10/12 h-auto order-2 desktop:order-1 mt-9 desktop:mt-0" aria-label="Illustration of a person with notes around" />

			<div class="desktop:absolute desktop:top-40 desktop:right-0 rounded-3xl bg-gray-800 p-6 desktop:p-8 w-11/12 max-w-sm order-1 desktop:order-2 mt-8 desktop:mt-0">
				<div class="-mt-12 -mr-10 desktop:-mr-12">
					<h1 class="mb-4 relative">
						Google Keep,<br>without Google.
						<IllustrationUnderlineLG aria-hidden class="pointer-events-none absolute -bottom-1" />
					</h1>
					<h2 class="mb-8">
						Keep your data private.<br>Open Source. Free. Join the Beta!
					</h2>

					<form class="flex gap-3" netlify>
						<TextInput v-model="formData.email" type="email" placeholder="hej@your.email" required class="rounded-r-none" />
						<Button type="submit" class="flex-shrink-0">Join the list!</Button>
					</form>
				</div>
			</div>
		</div>

		<div class="flex flex-col desktop:flex-row justify-center items-center gap-6 desktop:gap-10 relative z-10 desktop:p-8 desktop:-m-8 w-full">
			<a class="h-9 flex items-center gap-3 bg-gray-800 rounded-full px-5 order-2 desktop:order-1" href="https://supabase.io" target="_blank" rel="noreferrer" >
				Made with
				<img src="https://supabase.io/new/brand-assets/supabase-logo-wordmark--dark.svg" alt="Supabase logo" class="h-auto w-24" />
			</a>

			<a class="text-green-400 relative p-8 -m-8 order-1 desktop:order-2" href="https://twitter.com/madebyfabian" target="_blank" rel="noreferrer">
				@madebyfabian
				<IllustrationUnderlineSM aria-hidden class="pointer-events-none absolute bottom-8 right-8" />
			</a>
		</div>
	</div>
</template>

<script setup>
	import { reactive } from 'vue'
	import useSupabase from '@/hooks/useSupabase'

	// SVGs
	import LogoIcon from '@/assets/images/logo.svg'
	import IllustrationLandingPage from '@/assets/images/illustration-landing-page.svg'
	import IllustrationUnderlineLG from '@/assets/images/illustration-underline-lg.svg'
	import IllustrationUnderlineSM from '@/assets/images/illustration-underline-sm.svg'
	
	// Components
	import { TextInput, Button } from '@/components/ui'

	const supabase = useSupabase()

	const formData = reactive({
		email: '',
	})

	const formState = reactive({
		isSubmitting: false,
		isSuccess: false,
		isError: false,
	})

	const handleFormSubmit = async () => {
		try {
			formState.isSubmitting = true
			await supabase.from('waiting_list').insert([{ email: formData.email }])
			formState.isSuccess = true

		} catch (error) {
			formState.isError = true

		} finally {
			formState.isSubmitting = false
		}
	}
</script>

<style lang="postcss" scoped>
	@font-face {
		font-family: 'Geomanist';
		font-weight: 400;
		font-display: swap;
		src: url('/fonts/Geomanist-regular.woff2') format('woff2');
	}

	@font-face {
		font-family: 'Geomanist';
		font-weight: 700;
		font-display: swap;
		src: url('/fonts/Geomanist-bold.woff2') format('woff2');
	}

	.LandingPage {
		@media (hover: hover) {
			* {
				@apply transition duration-700;
			}

			*:not(input):not(button):hover {
				@apply transform translate-x-1 -translate-y-2 rotate-1 scale-105;
			}
		}

		h1 {
			@apply font-bold;
			font-size: 2.25rem;
			line-height: 110%;
			letter-spacing: -0.02em;
		}

		h2 {
			@apply font-normal normal-case text-gray-300 select-auto;
			font-size: 1.25rem;
			line-height: 130%;
			letter-spacing: -0.01em;
		}
	}
</style>