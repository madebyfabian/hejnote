<template>
  <SnackbarContainer />
  <ModalConfirm />
  
  <router-view/>
</template>

<script setup>
  import { computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import useSupabase from '@/hooks/useSupabase'
	import { generalStore } from '@/store'
	import { getRequiredAuthRedirect } from '@/utils/routeBeforeEach'

	import SnackbarContainer from '@/components/SnackbarContainer.vue'
	import ModalConfirm from '@/components/ModalConfirm.vue'

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