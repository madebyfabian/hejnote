<template>
	<aside class="Sidebar">
		<ul>
			<SidebarSubheadline v-if="isHiddenMode">Hidden</SidebarSubheadline>
			<SidebarItem :to="{ name: 'App-Home', params }">
				All Notes
			</SidebarItem>

			<template v-if="collectionsStore.state.collections.length">
				<SidebarSubheadline>{{ isHiddenMode ? 'Hidden ' : null }}Collections</SidebarSubheadline>

				<SidebarItem 
					v-for="collection of collectionsStore.state.collections" :key="collection.id"
					:to="{ name: 'App-Collection', params: { ...params, collectionId: collection.id } }">

					{{ collection.title }}
				</SidebarItem>
			</template>
			
			<SidebarSubheadline>{{ isHiddenMode ? 'Hidden ' : null }}Others</SidebarSubheadline>
			<SidebarItem :to="{ name: 'App-Archive', params }">
				Archive
			</SidebarItem>
			<SidebarItem :to="{ name: 'App-Deleted', params }">
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
		@apply absolute left-0 flex flex-col justify-between h-96;
	}
</style>

<script setup>
	import { computed } from 'vue'
	import { collectionsStore } from '@/store'
	import { useRoute, useRouter } from 'vue-router'
	import useIsHiddenMode from '@/hooks/useIsHiddenMode'
	import Switch from '@/components/Switch.vue'
	import SidebarItem from '@/components/layouts/Sidebar-Item.vue'
	import SidebarSubheadline from '@/components/layouts/Sidebar-Subheadline.vue'
	import SidebarHiddenModeBanner from '@/components/layouts/Sidebar-HiddenModeBanner.vue'

	const isHiddenMode = useIsHiddenMode()
	const route = useRoute()
	const router = useRouter()

	const handleSwitchHiddenMode = () => {
		router.push({
			name: route.name,
			params: {
				isHiddenMode: isHiddenMode.value ? null : 'hidden'
			}
		})
	}

	const params = computed(() => {
		if (isHiddenMode.value) 
			return Object.assign({}, { isHiddenMode: 'hidden' })
		else
			return Object.assign({}, {})
	})
</script>