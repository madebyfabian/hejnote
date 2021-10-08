<template>
	<aside class="Sidebar">
		<ul>
			<SidebarSubheadline v-if="isHiddenMode">Hidden</SidebarSubheadline>
			<SidebarItem :to="{ name: 'App-Home' }">
				Notes
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
			<SwitchHiddenMode />
		</div>

		<SidebarHiddenModeBanner :isDisplayed="isHiddenMode" />
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
	import { SidebarItem, SidebarSubheadline, SidebarHiddenModeBanner } from '@/components/Sidebar'
	import SwitchHiddenMode from '@/components/SwitchHiddenMode.vue'

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)
</script>