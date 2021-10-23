<template>
	<aside class="Sidebar">
		<ul>
			<SidebarItem :to="{ name: 'App-Home' }">
				Notes
			</SidebarItem>

			<div class="group" v-if="collectionsStore.state.collections.length">
				<div class="flex items-end">
					<LocalSubheadline class=" relative">
						{{ isHiddenMode ? 'Hidden ' : null }}Collections
					</LocalSubheadline>

					<div class="opacity-0 mb-2 ml-3 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
						<ButtonIconOnly isInline :icon="IconEdit" @click="generalStore.updateUpdateCollectionsModalVisible({ newVal: true })">
							Edit collections
						</ButtonIconOnly>
					</div>
				</div>

				<SidebarItem 
					v-for="collection of collectionsStore.state.collections" :key="collection.id"
					:to="{ name: 'App-Collection', params: { collectionId: collection.id } }">

					{{ collection.title }}
				</SidebarItem>
			</div>
			
			<LocalSubheadline>Others</LocalSubheadline>
			<SidebarItem :to="{ name: 'App-Archive' }">
				Archive
			</SidebarItem>
			<SidebarItem :to="{ name: 'App-Deleted' }">
				Trash
			</SidebarItem>
			<SidebarItem v-if="isDev" :to="{ name: 'App-Test' }">
				⚙️ Test
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

	const isDev = import.meta.env.DEV

	const LocalSubheadline = defineComponent({
		template: `<h2 class="pt-6 pb-2 pl-5"><slot /></h2>`
	})

	const isHiddenMode = computed(() => generalStore.state.isHiddenMode)
</script>