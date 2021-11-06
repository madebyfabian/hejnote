<template>
	<div 
		class="TabNav fixed bottom-0 left-0 w-full z-40 px-3 pb-safe-area-bottom pt-4 bg-gradient-to-t from-gray-900 via-gray-900"
		:class="props.class">
		<div class="relative flex justify-between w-full z-1">
			<!-- Home -->
			<TabNav-Item :to="{ name: 'App-Home' }" :isActive="isActiveTab('App-Home')">
				<template #icon><component :is="IconNotes" /></template>
				<template #activeIcon><component :is="IconNotesSolid" /></template>
				Notes
			</TabNav-Item>

			<!-- Collections -->
			<ContextMenuCollections isTypeNavigation transformOrigin="36% bottom" isFixed isFullWidth verticalAlign="top" cssClass="w-[20%]">
				<template #button>
					<TabNav-Item :isActive="isActiveTab('App-Collection')"  class="min-w-full">
						<template #icon><component :is="IconCollectionMove" /></template>
						<template #activeIcon><component :is="IconCollectionMoveSolid" /></template>
						Collections
					</TabNav-Item>
				</template>
			</ContextMenuCollections>

			<!-- Add note -->
			<div class="w-[20%] flex justify-center">
				<!-- Exeption: I didn't used <Button> here, but it's okay -->
				<button 
					@click="() => notesStore.toggleCreateNoteModal({ isVisible: true })"
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
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import { generalStore, notesStore } from '@/store'

	import { Avatar } from '@/components/ui'
	import { TabNavItem, ContextMenuCollections } from '@/components/layouts'
	import { IconCollectionMove, IconCollectionMoveSolid, IconNotes, IconNotesSolid, IconMore, IconMoreSolid, IconAdd } from '@/assets/icons'

	const props = defineProps({
		class: { default: '' }
	})

	const route = useRoute()
	const userName = computed(() => generalStore.getUserName())

	const isActiveTab = (routeName) => {
		return route.name === routeName
	}
</script>