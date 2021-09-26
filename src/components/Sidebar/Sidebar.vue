<template>
	<aside class="Sidebar">
		<ul>
			<SidebarSubheadline v-if="isHiddenMode">Hidden</SidebarSubheadline>
			<SidebarItem :to="{ name: 'App-Home' }">
				All Notes
			</SidebarItem>

			<SidebarItem :to="{ name: 'App-Uncategorized' }">
				Uncategorized
			</SidebarItem>

			<template v-if="collectionsStore.state.collections.length">
				<SidebarSubheadline>{{ isHiddenMode ? 'Hidden ' : null }}Collections</SidebarSubheadline>

				<SidebarItem 
					v-for="collection of collectionsStore.state.collections" :key="collection.id"
					:to="{ name: 'App-Collection', params: { collectionId: collection.id } }">

					{{ collection.title }}
				</SidebarItem>
			</template>
			
			<SidebarSubheadline>{{ isHiddenMode ? 'Hidden ' : null }}Others</SidebarSubheadline>
			<SidebarItem :to="{ name: 'App-Archive' }">
				Archive
			</SidebarItem>
			<SidebarItem :to="{ name: 'App-Deleted' }">
				Trash
			</SidebarItem>
		</ul>

		<div class="fixed bottom-2 left-2 z-10">
			<Switch
				:value="isHiddenMode" 
				@change="handleSwitchHiddenMode"
				label="Hidden mode" 
			/>
		</div>

		<SidebarHiddenModeBanner 
			:isDisplayed="isHiddenMode" 
			@close="handleSwitchHiddenMode"
		/>
	</aside>
</template>

<style lang="postcss" scoped>
	.Sidebar {
		@apply fixed left-0 flex flex-col justify-between h-96;
	}
</style>

<script setup>
	import { computed } from 'vue'
	import { generalStore, collectionsStore } from '@/store'
	import { useRoute, useRouter } from 'vue-router'

	import { Switch } from '@/components/ui'
	import { SidebarItem, SidebarSubheadline, SidebarHiddenModeBanner } from '@/components/Sidebar'

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)
	const route = useRoute()
	const router = useRouter()

	const handleSwitchHiddenMode = () => {
		return router.push({ 
			name: route.name,
			query: route.query,
			hash: route.hash,
			params: {
				...route.params, 
				isHiddenMode: isHiddenMode.value ? null : 'hidden' 
			} 
		})
	}
</script>