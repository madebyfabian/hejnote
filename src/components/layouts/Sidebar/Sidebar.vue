<template>
	<aside class="Sidebar">
		<ul>
			<SidebarItem :to="{ name: 'App-Home' }">
				Notes
			</SidebarItem>

			<template v-if="collectionsStore.state.collections.length">

				<LocalSubheadline class="group relative">
					{{ isHiddenMode ? 'Hidden ' : null }}Collections
	
					<div class="absolute right-0 bottom-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
						<ButtonIconOnly isInline :icon="IconEdit" @click="generalStore.updateUpdateCollectionsModalVisible({ newVal: true })">
							Edit collections
						</ButtonIconOnly>
					</div>
				</LocalSubheadline>

				<SidebarItem 
					v-for="collection of collectionsStore.state.collections" :key="collection.id"
					:to="{ name: 'App-Collection', params: { collectionId: collection.id } }">

					{{ collection.title }}
				</SidebarItem>
			</template>
			
			<LocalSubheadline>Others</LocalSubheadline>
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
	import { computed, defineComponent } from 'vue'
	import { generalStore, collectionsStore } from '@/store'
	import { SidebarItem } from '@/components/layouts'
	import { Button, ButtonIconOnly } from '@/components/ui'
	import { IconEdit } from '@/assets/icons'

	const LocalSubheadline = defineComponent({
		template: `<h2 class="pt-6 pb-2 pl-5 first:pt-0"><slot /></h2>`
	})

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)
</script>