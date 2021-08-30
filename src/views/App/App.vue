<template>
	<router-view v-slot="{ Component }">
		<transition name="transition-fade-100">
			<div v-if="!generalStore.state.isAppLoading">
				<Header />
				<Sidebar />
				<main class="container">
					<component :is="Component" />
				</main>
			</div>
		</transition>
	</router-view>
</template>

<script setup>
	import { onMounted } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import useSupabase from '@/hooks/useSupabase'
	import { store } from '@/store'
	import { generalStore } from '@/store/generalStore'

	// Components
	import Header from '@/components/layouts/Header.vue'
	import Sidebar from '@/components/layouts/Sidebar.vue'

	// Route update check
	import { onBeforeRouteUpdate } from 'vue-router'
	import beforeAppRouteEnterUpdate from '@/utils/beforeAppRouteEnterUpdate'

	onBeforeRouteUpdate(beforeAppRouteEnterUpdate)

	const router = useRouter()

	onMounted(async () => {
		generalStore.updateUser({ user: useSupabase().auth.user() })

		// React to auth state changes
		useSupabase().auth.onAuthStateChange((_, session) => {
      if (session?.user) 
				generalStore.updateUser({ user: session.user })
      else
        return router.push({ name: 'Auth' })
    })

		// Load all app data
		await Promise.all([
			store.notesFetch(),
			store.collectionsFetch(),
			store.joinNotesCollectionsFetch(),
			store.joinNotesLinksFetch(),
			store.linksFetch(),
		])

		generalStore.updateIsAppLoading(false)
	})
</script>