<template>
  <NoteList :notes="notes" :title="collection?.title || 'Notes'">
		<template v-if="!collectionId" #empty-state>
			There are no notes which aren't inside a collection.
		</template>
		
		<template v-if="!collectionId" #heading-right>
			<ContextMenu align="right" @changedOpenState="newVal => displayModeContextMenuIsOpened = newVal">
				<template #button>
					<Button 
						buttonType="tertiary" 
						:isDropdownOpened="displayModeContextMenuIsOpened" 
						hasNegativeMargin 
						is="div">
						
						<span class="sr-only">Choose display mode:</span>
						{{ displayModeOptions[displayModeActiveOptionKey] }}
					</Button>
				</template>

				<ContextMenu-Item
					v-for="(option, key) in displayModeOptions" :key="key" 
					:cellProps="{ isSelected: key === displayModeActiveOptionKey }"
					@click="() => handleDisplayModeApplyOption({ key })">
					
					{{ option }}
				</ContextMenu-Item>
			</ContextMenu>
    </template>
	</NoteList>
</template>

<script setup>
  import { computed, ref } from 'vue'
	import { notesStore, generalStore } from '@/store'
	import useCurrentCollection from '@/hooks/useCurrentCollection'

	// Components
	import { Button, ContextMenu, ContextMenuItem } from '@/components/ui'
	import { NoteList } from '@/components'


	const collection = useCurrentCollection(),
				collectionId = computed(() => collection.value?.id)
	

	// Display mode context menu
	const displayModeOptions = { all: 'All Notes', onlyOutsideCollections: 'Notes outside Collections', },
				displayModeContextMenuIsOpened = ref(false),
				displayModeActiveOptionKey = generalStore.appOptions.displayMode

	const handleDisplayModeApplyOption = ({ key }) => {
		displayModeActiveOptionKey.value = key
	}
	// ---


	const notes = computed(() => {
		if (collectionId.value || displayModeActiveOptionKey.value === 'all') 
			return notesStore.notesFilterByCollection({ collectionId: collectionId.value || '' })
		else
			return notesStore.notesFilterOnlyWithoutCollection()
	})
</script>