<template>
  <NoteList :notes="notes" :title="collection?.title || 'Notes'">
		<template v-if="!collectionId" #empty-state>
			There are no notes which aren't inside a collection.
		</template>
		
		<template v-if="!collectionId" #heading-right>
			<ContextMenuV2 align="right" @changedOpenState="newVal => displayModeContextMenuIsOpened = newVal">
				<template #button>
					<Button 
						buttonType="tertiary" 
						displayAsDropdown 
						:displayAsDropdownOpened="displayModeContextMenuIsOpened" 
						noPadding 
						is="div">
						
						<span class="sr-only">Choose display mode:</span>
						{{ displayModeOptions[displayModeActiveOptionKey] }}
					</Button>
				</template>

				<ContextMenuV2-Item
					v-for="(option, key) in displayModeOptions" :key="key" 
					:cellProps="{ isSelected: key === displayModeActiveOptionKey }"
					@click="() => handleDisplayModeApplyOption({ key })">
					
					{{ option }}
				</ContextMenuV2-Item>
			</ContextMenuV2>
    </template>
	</NoteList>
</template>

<script setup>
  import { computed, nextTick, ref, watch } from 'vue'
	import { notesStore, generalStore } from '@/store'
	import useCurrentCollection from '@/hooks/useCurrentCollection'
	import { useRoute, useRouter } from 'vue-router'
	import useGenerateRouterLink from '@/hooks/useGenerateRouterLink'

	// Components
	import { Button } from '@/components/ui'
	import NoteList from '@/components/NoteList.vue'
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'

	const { generateRouterLink } = useGenerateRouterLink() 
	const router = useRouter(),
				route = useRoute()
	
	// Display mode context menu
	const displayModeOptions = { all: 'All Notes', onlyOutsideCollections: 'Notes outside Collections', },
				displayModeContextMenuIsOpened = ref(false),
				displayModeActiveOptionKey = generalStore.appOptions.displayMode

	const handleDisplayModeApplyOption = ({ key }) => {
		displayModeActiveOptionKey.value = key
	}
	// ---
	

	const collection = useCurrentCollection(),
				collectionId = computed(() => collection.value?.id)




	const routeParamCollectionId = computed(() => route.params?.collectionId)

	// Watch for hidden mode changes (e.g. hidden => default), because when we are inside a collection, 
	// we have to redirect to home, since this collection will not be available in default mode, since it's a hidden one.
	watch(() => generalStore.state.isHiddenMode, async () => {
		if (!route.params?.collectionId)
			return

		setTimeout(() => {
			router.replace(generateRouterLink({ name: 'App-Home' }).value)
		}, 10)
		
	}, { immediate: true })



	const notes = computed(() => {
		if (collectionId.value || displayModeActiveOptionKey.value === 'all') 
			return notesStore.notesFilterByCollection({ collectionId: collectionId.value || '' })
		else
			return notesStore.notesFilterOnlyWithoutCollection()
	})
</script>