<template>
	<div class="TabNav px-3 bg-gray-900 pb-safe-area-bottom">
		<div class="relative flex justify-between w-full" :id="wrapperId">
			<TabNav-ActiveIndicator 
				:tabNavWrapperId="wrapperId"
				:activeTabItemRouteName="activeTabItemRouteName"
			/>

			<TabNav-Item 
				v-for="(item, key) of tabNavItems"
				:key="key"
				:to="item.route ? { name: item.route } : undefined"
				:isActive="isActiveTab(item.route)"
				:data-route-name="item.route"
				
				@click="e => handleTabNavItemClick({ e, item })">

				<template #icon><component :is="item.icon" /></template>

				{{ item.name }}
			</TabNav-Item>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { useRoute } from 'vue-router'

	import TabNavItem from '@/components/TabNav/TabNav-Item.vue'
	import TabNavActiveIndicator from '@/components/TabNav/TabNav-ActiveIndicator.vue'
	import { IconPin, IconCollectionMove } from '@/assets/icons'

	const route = useRoute()
	const wrapperId = 'TabNav-wrapper'

	const tabNavItems = [
		{ name: 'All Notes', route: 'App-Home', icon: IconPin, },
		{ name: 'Collections', route: undefined, icon: IconCollectionMove, },
		{ name: 'Archive', route: 'App-Archive', icon: IconCollectionMove, },
		{ name: 'Fabian', route: 'App-Account', icon: IconCollectionMove, },
	]

	// Define the active Tab item on initial load. this is NOT reactive.
	const activeTabItemRouteName = ref(route.name)

	const isActiveTab = (routeName) => {
		return route.name === routeName
	}

	const handleTabNavItemClick = ({ e, item }) => {
		if (item.name === 'Collections'){
			console.log('Clicked collections')
			return e.preventDefault()
		}

		activeTabItemRouteName.value = item.route
	}
</script>