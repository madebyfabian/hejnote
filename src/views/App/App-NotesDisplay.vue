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
  import { computed, ref } from 'vue'
	import { notesStore, generalStore } from '@/store'
	import useCurrentCollection from '@/hooks/useCurrentCollection'

	// Components
	import { Button } from '@/components/ui'
	import NoteList from '@/components/NoteList.vue'
	import ContextMenuV2 from '@/components/ContextMenuV2.vue'
	import ContextMenuV2Item from '@/components/ContextMenuV2-Item.vue'
	
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

	const notes = computed(() => {
		if (collectionId.value || displayModeActiveOptionKey.value === 'all') 
			return notesStore.notesFilterByCollection({ collectionId: collectionId.value || '' })
		else
			return notesStore.notesFilterOnlyWithoutCollection()
	})
</script>