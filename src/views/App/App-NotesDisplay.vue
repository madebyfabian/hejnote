<template>
  <NoteList :notes="notes" title="Notes">
		<template v-if="!collectionId" #empty-state>
			There are no notes which aren't inside a collection.
		</template>
		
		<template v-if="!collectionId" #heading-right>
			<ContextMenu 
				:isOpened="displayModeMenuIsOpened" 
				@toggleIsOpened="newVal => displayModeMenuIsOpened = newVal"
				:buttonProps="{ buttonType: 'tertiary', displayAsDropdown: true, displayAsDropdownOpened: displayModeMenuIsOpened, noPadding: true }"
				align="right">

				<template #button>
					<span class="sr-only">Choose display mode:</span>
					{{ displayModeOptions[displayModeActiveOptionKey] }}
				</template>

				<li>
					<Cell 
						v-for="(option, key) in displayModeOptions" :key="key" 
						isClickable 
						@click="() => handleDisplayModeApplyOption({ key })">

						<template #icon>
							<div class="h-5 w-5">
								<IconCheck v-if="key === displayModeActiveOptionKey" />
							</div>
						</template>

						{{ option }}
					</Cell>
				</li>
			</ContextMenu>
    </template>
	</NoteList>
</template>

<script setup>
  import { computed, ref } from 'vue'
	import { notesStore, generalStore } from '@/store'
	import useCurrentCollection from '@/hooks/useCurrentCollection'

	// Components
	import { Cell } from '@/components/ui'
	import { IconCheck } from '@/assets/icons'
	import ContextMenu from '@/components/ContextMenu.vue'
	import NoteList from '@/components/NoteList.vue'

	
	// Display mode context menu
	const displayModeOptions = { all: 'All Notes', onlyOutsideCollections: 'Notes outside Collections', },
				displayModeMenuIsOpened = ref(false),
				displayModeActiveOptionKey = generalStore.appOptions.displayMode

	const handleDisplayModeApplyOption = ({ key }) => {
		displayModeMenuIsOpened.value = false
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