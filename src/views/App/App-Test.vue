<template>
	<TextInput 
		v-model="searchNotesString" 
		:inputProps="{ placeholder: 'Search for something', required: true, spellcheck: false }" 
		class="mb-4">

		<template #icon>
			<IconSearch />
		</template>
	</TextInput>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'

	import { TextInput } from '@/components/ui'
	import { IconSearch } from '@/assets/icons'

	const route = useRoute(),
				router = useRouter()	

	const searchNotesString = computed({
		get() 			{ return route.query?.q || '' },
		set(newVal)	{ router.push({ query: { q: newVal } }) }
	})
</script>