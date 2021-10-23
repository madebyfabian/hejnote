<template>
	<button class="v2" @click="useSnackbar().createSnackbar({ timeout: 999999, message: 'Content<br>haha', buttonText: 'test' })">
		Create snackbar
		<span></span>
	</button>

	<br><br>
	<div style="width: 1400px; margin-left: -150px" class="mb-24">
		<h1 class="mb-4">Current buttons:</h1>
		
		<div class="grid grid-cols-5 gap-4">
			<section>
				<Button buttonType="primary">Primary</Button>
			</section>
			<section>
				<Button buttonType="secondary">Secondary</Button>
			</section>
			<section>
				<Button buttonType="tertiary">Tertiary</Button>
			</section>
			<section>
				<Button buttonType="inline">Inline</Button>
			</section>
			<section>
				<ButtonIconOnly :icon="IconSearch">_</ButtonIconOnly>
			</section>

			<section>
				<Button buttonType="primary" noRoundedBorder>Primary, noRoundedBorder</Button>
			</section>
			<section>
				<Button buttonType="secondary" noRoundedBorder>Secondary, noRoundedBorder</Button>
			</section>
			<section>
				<Button buttonType="tertiary" noRoundedBorder>Tertiary, noRoundedBorder</Button>
			</section>
			<section>
				<Button buttonType="inline" noRoundedBorder>Inline, noRoundedBorder</Button>
			</section>
			<br>

			<section>
				<Button buttonType="primary" isFullWidth>Primary, isFullWidth</Button>
			</section>
			<section>
				<Button buttonType="secondary" isFullWidth>Secondary, isFullWidth</Button>
			</section>
			<section>
				<Button buttonType="tertiary" isFullWidth>Tertiary, isFullWidth</Button>
			</section>
			<section>
				<Button buttonType="inline" isFullWidth>Inline, isFullWidth</Button>
			</section>
			<br>

			<section>
				<Button buttonType="primary" isLoading>Primary, isLoading</Button>
			</section>
			<section>
				<Button buttonType="secondary" isLoading>Secondary, isLoading</Button>
			</section>
			<section>
				<Button buttonType="tertiary" isLoading>Tertiary, isLoading</Button>
			</section>
			<section>
				<Button buttonType="inline" isLoading>Inline, isLoading</Button>
			</section>
			<br>

			<section class="flexible">
				<Button buttonType="primary" hasNegativeMargin>Primary, hasNegativeMargin</Button>
			</section>
			<section class="flexible">
				<Button buttonType="secondary" hasNegativeMargin>Secondary, hasNegativeMargin</Button>
			</section>
			<section class="flexible">
				<Button buttonType="tertiary" hasNegativeMargin>Tertiary, hasNegativeMargin</Button>
			</section>
			<section class="flexible">
				<Button buttonType="inline" hasNegativeMargin>Inline, hasNegativeMargin</Button>
			</section>
			<section class="flexible">
				<ButtonIconOnly :icon="IconSearch" isInline>_</ButtonIconOnly>
			</section>

			<section>
				<Button buttonType="primary" :isDropdownOpened="false">isDropdownOpened=false</Button>
			</section>
			<section>
				<Button buttonType="secondary" :isDropdownOpened="false">isDropdownOpened=false</Button>
			</section>
			<section>
				<Button buttonType="tertiary" :isDropdownOpened="false">isDropdownOpened=false</Button>
			</section>
			<section>
				<Button buttonType="inline" :isDropdownOpened="false">isDropdownOpened=false</Button>
			</section>
			<br>

			<section>
				<Button buttonType="primary" isDropdownOpened>isDropdownOpened=true</Button>
			</section>
			<section>
				<Button buttonType="secondary" isDropdownOpened>isDropdownOpened=true</Button>
			</section>
			<section>
				<Button buttonType="tertiary" isDropdownOpened>isDropdownOpened=true</Button>
			</section>
			<section>
				<Button buttonType="inline" isDropdownOpened>isDropdownOpened=true</Button>
			</section>
			<br>

		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { generalStore, notesStore } from '@/store'
	import { Button, ButtonIconOnly, LoadingSpinner } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'
	import useSnackbar from '@/hooks/useSnackbar'

	const isInteractionVisible = ref(false)

	const promiseTimeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
</script>

<style lang="postcss" scoped>
	button.v2 {
		@apply p-2 rounded-xl;

		
		@apply bg-gray-700 border-transparent hover:bg-opacity-25;


		--transition-none: border-color 0ms ease,	background-color 0ms ease;
		@apply border bg-opacity-0;
		transition: border-color 750ms ease, background-color 100ms ease;


		&:active {
			@apply border-gray-600 bg-opacity-75;

			transition: var(--transition-none);
		}
	}




	/** unrelated */
	section {
		@apply bg-gray-800 rounded-xl px-2 py-6 flex items-center justify-center h-32;

		&.flexible {
			@apply h-fit;
		}
	}
</style>