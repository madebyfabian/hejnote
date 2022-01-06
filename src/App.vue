<template>
  <SkipNavigation to="#main" label="Skip to main content" />

  <SnackbarContainer />
  <ModalConfirm />

	<router-view />
</template>

<script setup>
  import { computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import SkipNavigation from 'headless-utils/src/vue3/skip-navigation'
	import useSupabase from '@/hooks/useSupabase'
	import { generalStore } from '@/store'
	import { getRequiredAuthRedirect } from '@/router/routeBeforeEach'

	import { SnackbarContainer, ModalConfirm } from '@/components/layouts'

	const route = useRoute(),
				router = useRouter()
	const routeRequiresAuth = computed(() => route.meta.requiresAuth)

	// React to auth state changes
	useSupabase().auth.onAuthStateChange((_, session) => {
		// Update store
		let user = session?.user
		generalStore.updateUser({ user })

		// this onAuthStateChange also fires on app load. but we don't want redirects on app load. 
		// since router already handles that!
		if (routeRequiresAuth.value === undefined)
			return

		// Redirect if required.
		const requiredRedirect = getRequiredAuthRedirect({ user, requiresAuth: routeRequiresAuth.value })
		if (requiredRedirect) 
			return router.push(requiredRedirect)
	})
</script>

<style lang="postcss" scoped>
	.SkipNavigation {
		@apply fixed z-70 bg-gray-900 p-6 top-4 left-4 rounded-xl font-bold;

		&:not([data-is-focused=true]) {
			@apply sr-only;
		}
	}
</style>