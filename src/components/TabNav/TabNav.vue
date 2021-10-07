<template>
	<div class="TabNav px-3 pb-safe-area-bottom relative pt-4 bg-gradient-to-t from-gray-900 via-gray-900">
		<div class="relative flex justify-between w-full z-1" id="TabNav-wrapper">
			<div
				v-for="(item, key) of tabNavItems"
				:key="key"
				class="relative">

				<ContextMenuV2 
					v-if="item.name === 'Collections'" 
					transformOrigin="36% bottom"
					isFixed 
					isFullWidth 
					verticalAlign="top">

					<template #button>
						<TabNav-Item 
							:isActive="isActiveTab('App-Collection')">

							<template #icon>
								<component :is="item.icon" />
							</template>

							<template #activeIcon>
								<component v-if="item.activeIcon" :is="item.activeIcon" />
							</template>

							{{ item.name }}
						</TabNav-Item>
					</template>

					<ContextMenuV2-Item
						v-for="collection of collectionsStore.state.collections" :key="collection.id"
						:displayAsSelected="collection.id === route.params?.collectionId"
						@click="router.push({ name: 'App-Collection', params: { collectionId: collection.id } })">
						
						{{ collection.title }}
					</ContextMenuV2-Item>
				</ContextMenuV2>

				<TabNav-Item 
					v-else
					:to="item.route ? { name: item.route } : undefined"
					:isActive="isActiveTab(item.route)">

					<template #icon>
						<component v-if="item.route !== 'App-Account'" :is="item.icon" />
						<Avatar v-else :name="userName" isSmall :isActive="isActiveTab(item.route)" />
					</template>

					<template #activeIcon>
						<component v-if="item.activeIcon" :is="item.activeIcon" />
					</template>

					{{ item.name }}
				</TabNav-Item>				
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { generalStore, collectionsStore } from '@/store'

	import { Avatar } from '@/components/ui'
	import TabNavItem from '@/components/TabNav/TabNav-Item.vue'
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'
	import { IconCollectionMove, IconNotes, IconNotesSolid, IconArchive, IconArchiveSolid } from '@/assets/icons'

	const userName = computed(() => generalStore.getUserName())

	const router = useRouter(),
				route = useRoute()

	const tabNavItems = [
		{ name: 'Notes', route: 'App-Home', icon: IconNotes, activeIcon: IconNotesSolid },
		{ name: 'Collections', icon: IconCollectionMove, },
		{ name: 'Archive', route: 'App-Archive', icon: IconArchive, activeIcon: IconArchiveSolid },
		{ name: userName.value, route: 'App-Account', },
	]

	const isActiveTab = (routeName) => {
		return route.name === routeName
	}
</script>