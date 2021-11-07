<template>
	<header v-if="!isMinimal" class="Header">
		<AppLink :to="{ name: 'App-Home' }" class="flex-1 select-none">
			<LogoIcon alt="Logo" class="ml-5" />
		</AppLink>

		<div class="Header-centerContent container h-11">
			<transition name="transition-fadeAndScale-fast" mode="out-in">
				<div v-if="!isSearchFocussed" class="flex gap-4">
					<div class="Header-createNoteButtonBar flex-1 rounded-input bg-gray-900 flex divide-x divide-gray-750-standaloneBorder">
						<button 
							class="flex-1 cursor-text" 
							@click="() => notesStore.toggleCreateNoteModal({ isVisible: true })">

							<TextInput 
								modelValue="" 
								:inputProps="{ placeholder: 'Write something...', disabled: true }" 
								inputBgGray 
								inputBorderHidden
								class="pointer-events-none flex-1">

								<template #icon>
									<IconAdd />
								</template>
							</TextInput>
						</button>

						<Button
							@click="() => notesStore.toggleCreateNoteModal({ isVisible: true, startWithNewLink: true })" 
							buttonType="tertiary" 
							customRoundedBorderClass="rounded-r-button">

							<IconLinkAdd />
							Create Linklist
						</Button>
					</div>
			
					<div class="bg-gray-1000 rounded-button">
						<Button buttonType="secondary" @click="navigateToSearch">
							<IconSearch />
							Search for something
						</Button>
					</div>
				</div>

				<SearchNotesBar v-else />
			</transition>
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
	import { generalStore, notesStore } from '@/store'
	import { useRoute, useRouter } from 'vue-router'
	import { AppLink, Avatar, Button, TextInput } from '@/components/ui'
	import { IconSearch, IconAdd, IconLinkAdd } from '@/assets/icons'
	import { SearchNotesBar } from '@/components/layouts'
	import useGenerateRouterLink from '@/hooks/useGenerateRouterLink'

	import LogoIcon from '@/assets/images/logo.svg'

	defineProps({
		isMinimal: { type: Boolean, default: false, },
	})

	const { generateRouterLink } = useGenerateRouterLink() 
	const route = useRoute()
	const router = useRouter()

	const userName = computed(() => generalStore.getUserName())
	const isSearchFocussed = computed(() => route.name === 'App-Search')

	const navigateToSearch = () => {
		const routeToNavigate = 'App-Search'
		if (route.name === routeToNavigate)
			return

		router.push(generateRouterLink({ name: 'App-Search' }).value)
	}
</script>

<style lang="postcss" scoped>
	.Header:not(.isMinimal) {
		@apply fixed top-0 left-0 w-full z-40 flex items-center pt-5;	
	}

	/**
	 * Overlay bg gradients
	 */
	.Header-centerContent {
		@apply relative;

		&::after, &::before {
			@apply content absolute left-0 w-full -z-1 pointer-events-none;
		}

		&::after {
			@apply -top-5 h-14 backdrop-blur-xl bg-gray-1000 bg-opacity-75;
		}

		&::before {
			@apply top-8 h-10 bg-gradient-to-b from-gray-1000 to-transparent;
		}
	}

	.Header-createNoteButtonBar {
		@apply relative;

		&::after {
			@apply content pointer-events-none rounded-inherit;
			@apply absolute left-0 top-0 w-full h-full z-1;
			@apply border border-gray-750-standaloneBorder;
		}
	}
</style>
