<template>
	<div class="SearchNotesBar flex gap-2">
		<TextInput 
			v-model="searchNotesString" 
			@mountedInput="({ inputEl }) => doAutofocus(inputEl)"
			:inputProps="{ 
				placeholder: 'Search for something', 
				required: true, 
				spellcheck: false
			}" 
			inputBgGray
			class="mb-8 flex-1">

			<template #icon>
				<IconSearch />
			</template>
		</TextInput>

		<div class="-mr-4 desktop:-mr-0">
			<Button 
				v-if="checkIfRouterCanGoBack()"
				buttonType="tertiary" 
				@click="router.go(-1)">
				
				Cancel
			</Button>
		</div>
	</div>
</template>

<script setup>
	import { computed, onBeforeMount, ref, watch } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { TextInput, Button } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'

	const route = useRoute(),
				router = useRouter()

	const searchNotesString = ref('')

	onBeforeMount(() => {
		searchNotesString.value = route.query?.q || ''
	})

	watch(searchNotesString, newVal => {
		router.replace({ query: { q: newVal } })
	})

	const doAutofocus = el => {
		el?.focus()
	}

	const checkIfRouterCanGoBack = () => {
		return window.history.length && window.history.state.back
	}
</script>