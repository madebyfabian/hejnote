<template>
	<div class="TabNav fixed bottom-0 left-0 w-full z-40 px-3 pb-safe-area-bottom pt-4 bg-gradient-to-t from-gray-900 via-gray-900">
		<div class="relative flex justify-between w-full z-1">
			<!-- Home -->
			<TabNav-Item :to="{ name: 'App-Home' }" :isActive="isActiveTab('App-Home')">
				<template #icon><component :is="IconNotes" /></template>
				<template #activeIcon><component :is="IconNotesSolid" /></template>
				Notes
			</TabNav-Item>

			<!-- Collections -->
			<ContextMenuV2 transformOrigin="36% bottom" isFixed isFullWidth verticalAlign="top" cssClass="w-[20%]">
				<template #button>
					<TabNav-Item :isActive="isActiveTab('App-Collection')" class="min-w-full">
						<template #icon><component :is="IconCollectionMove" /></template>
						<template #activeIcon><component :is="IconCollectionMoveSolid" /></template>
						Collections
					</TabNav-Item>
				</template>

				<ContextMenuV2-Item
					v-for="collection of collectionsStore.state.collections" :key="collection.id"
					:cellProps="{ 
						isSelected: collection.id === route.params?.collectionId,
						isTypeNavigation: true 
					}"
					@click="router.push({ name: 'App-Collection', params: { collectionId: collection.id } })">
					{{ collection.title }}
				</ContextMenuV2-Item>
			</ContextMenuV2>

			<!-- Add note -->
			<div class="w-[20%] flex justify-center">
				<button 
					@click="showCreateNoteEditor = true"
					class="h-12 w-12 rounded-2.5xl bg-gradient-to-b from-green-400 to-green-600 text-gray-900 flex justify-center items-center mt-2">
					
					<IconAdd />
				</button>
			</div>

			<!-- More -->
			<TabNav-Item :to="{ name: 'App-MobileMore' }" :isActive="isActiveTab('App-MobileMore')">
				<template #icon><component :is="IconMore" /></template>
				<template #activeIcon><component :is="IconMoreSolid" /></template>
				More
			</TabNav-Item>

			<!-- Account -->
			<TabNav-Item :to="{ name: 'App-Account' }" :isActive="isActiveTab('App-Account')">
				<template #icon><Avatar :name="userName" isSmall :isActive="isActiveTab('App-Account')" /></template>
				{{ userName }}
			</TabNav-Item>		
		</div>
	</div>

	<TabNav-CreateNoteEditor :isOpened="showCreateNoteEditor" @close="showCreateNoteEditor = false" />
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { generalStore, collectionsStore } from '@/store'

	import { Avatar } from '@/components/ui'
	import TabNavItem from '@/components/TabNav/TabNav-Item.vue'
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'
	import TabNavCreateNoteEditor from '@/components/TabNav/TabNav-CreateNoteEditor.vue'
	import { IconCollectionMove, IconCollectionMoveSolid, IconNotes, IconNotesSolid, IconMore, IconMoreSolid, IconAdd } from '@/assets/icons'

	const userName = computed(() => generalStore.getUserName())

	const router = useRouter(),
				route = useRoute()

	const showCreateNoteEditor = ref(false)

	const isActiveTab = (routeName) => {
		return route.name === routeName
	}
</script>