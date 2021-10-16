<template>
	<aside class="Sidebar">
		<ul>
			<SidebarItem :to="{ name: 'App-Home' }">
				Notes
			</SidebarItem>

			<template v-if="collectionsStore.state.collections.length">

				<SidebarSubheadline class="group relative">
					{{ isHiddenMode ? 'Hidden ' : null }}Collections
					<Button 
						buttonType="tertiary"
						class="absolute bottom-2.5"
						@click="generalStore.updateUpdateCollectionsModalVisible({ newVal: true })">

						<IconEdit class="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100" />
					</Button>
				</SidebarSubheadline>

				<SidebarItem 
					v-for="collection of collectionsStore.state.collections" :key="collection.id"
					:to="{ name: 'App-Collection', params: { collectionId: collection.id } }">

					{{ collection.title }}
				</SidebarItem>
			</template>
			
			<SidebarSubheadline>Others</SidebarSubheadline>
			<SidebarItem :to="{ name: 'App-Archive' }">
				Archive
			</SidebarItem>
			<SidebarItem :to="{ name: 'App-Deleted' }">
				Trash
			</SidebarItem>
		</ul>
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
	import { SidebarItem, SidebarSubheadline } from '@/components/layouts'
	import { Button } from '@/components/ui'
	import { IconEdit } from '@/assets/icons'

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)
</script>