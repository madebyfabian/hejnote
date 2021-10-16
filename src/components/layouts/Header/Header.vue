<template>
	<header v-if="!isMinimal" class="Header">
		<AppLink :to="{ name: 'App-Home' }" class="flex-1 select-none">
			<LogoIcon alt="Logo" class="ml-5" />
		</AppLink>

		<div class="flex container h-11">
			<div class="relative flex-1">
				<transition name="transition-fade-100">
					<Header-CreateNoteEditor v-show="!isSearchFocussed" />
				</transition>
				<div class="Header-bgGradient isTop"></div>
				<div class="Header-bgGradient isBottom"></div>
			</div>
		  <div class="ml-4">
				<Header-SearchNotesBar v-bind="{ isSearchFocussed }" />
			</div>
		</div>

		<div class="flex-1 flex justify-end items-center select-none">
			<AppLink :to="{ name: 'App-Account' }" class="mr-6 flex items-center">
				Hej,&nbsp;
				<span class="font-bold mr-3">{{ userName }}</span>
				<Avatar :name="userName" />
			</AppLink>
		</div>
	</header>

	<header v-else class="Header isMinimal flex justify-center pt-11 desktop:pt-14">
		<LogoIcon alt="Logo" class="h-7 w-auto relative z-10 mx-11" />
	</header>
</template>

<script setup>
	import { computed } from 'vue'
	import { generalStore } from '@/store'
	import { useRoute } from 'vue-router'

	// Import Components
	import { AppLink, Avatar } from '@/components/ui'
	import { HeaderCreateNoteEditor, HeaderSearchNotesBar } from '@/components/layouts'

	import LogoIcon from '@/assets/images/logo.svg'

	defineProps({
		isMinimal: { type: Boolean, default: false, },
	})

	const userName = computed(() => generalStore.getUserName())

	const route = useRoute()
	const isSearchFocussed = computed(() => route.name === 'App-Search')
</script>

<style lang="postcss" scoped>
	.Header:not(.isMinimal) {
		@apply fixed top-0 left-0 w-full z-40 flex items-center pt-5;

		&-bgGradient {
			@apply absolute left-0 w-full -z-1 pointer-events-none;

			&.isTop {
				@apply -top-5 h-8 backdrop-blur-xl bg-gray-900 bg-opacity-75;
			}

			&.isBottom {
				@apply top-8 h-10 bg-gradient-to-b from-gray-900 to-transparent;
			}
		}
	}
</style>