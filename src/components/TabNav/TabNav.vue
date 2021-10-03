<template>
	<div class="TabNav px-3 pb-safe-area-bottom relative pt-4 bg-gradient-to-t from-gray-900 via-gray-900">
		<div class="relative flex justify-between w-full z-1" id="TabNav-wrapper">
			<TabNav-Item 
				v-for="(item, key) of tabNavItems"
				:key="key"
				:to="item.route ? { name: item.route } : undefined"
				:isActive="isActiveTab(item.route)"
				:data-route-name="item.route"
				@click="e => handleTabNavItemClick({ e, item })">

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
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import { generalStore } from '@/store'

	import { Avatar } from '@/components/ui'
	import TabNavItem from '@/components/TabNav/TabNav-Item.vue'
	import { IconCollectionMove, IconNotes, IconNotesSolid, IconArchive, IconArchiveSolid } from '@/assets/icons'

	const userName = computed(() => generalStore.getUserName())

	const route = useRoute()

	const tabNavItems = [
		{ name: 'Notes', route: 'App-Home', icon: IconNotes, activeIcon: IconNotesSolid },
		{ name: 'Collections', route: 'App-Mobile-CollectionOverview', icon: IconCollectionMove, },
		{ name: 'Archive', route: 'App-Archive', icon: IconArchive, activeIcon: IconArchiveSolid },
		{ name: userName.value, route: 'App-Account', },
	]

	const isActiveTab = (routeName) => {
		return route.name === routeName
	}

	const handleTabNavItemClick = ({ e, item }) => {
		if (item.name === 'Collections'){
			return e.preventDefault()
		}

		activeTabItemRouteName.value = item.route
	}
</script>