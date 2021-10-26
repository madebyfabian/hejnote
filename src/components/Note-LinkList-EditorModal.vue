<template>
	<Modal 
		:isOpened="isOpened" 
		@close="$emit('close')"
		@formSubmit="handleSubmit"
		title="Add new link" 
		width="100" 
		isForm>

		<div class="flex flex-col gap-4">
			<TextInput v-model="formData.url" :inputProps="{ type: 'url', placeholder: 'Your Link', required: true }" />
			<TextInput v-model="formData.annotation" :inputProps="{ placeholder: 'Annotations for this link' }" />
		</div>

		<template #bottomBar>
			<Button type="submit" isFullWidth :isLoading="isSubmitButtonLoading">Save</Button>
		</template>
	</Modal>
</template>

<script setup>
	import { computed, reactive, ref } from 'vue'
	import { linksStore } from '@/store'
	import useSnackbar from '@/hooks/useSnackbar'
	import { Button, Modal, TextInput } from '@/components/ui'

	const emit = defineEmits([ 'close' ])

	const props = defineProps({
		isOpened: { type: Boolean, required: true },
		noteId: 	{ type: String, required: true },
	})

	const _default_formData = { url: '', annotation: '' }
	const formData = reactive({ ..._default_formData })
	const isSubmitButtonLoading = ref(false)

	const handleSubmit = async () => {
		isSubmitButtonLoading.value = true

		try {
			await linksStore.linksUpsert({
				linkObjArr: [ linksStore.getLinkDefaultDataObject({ link: { url: formData.url } }) ],
				noteId: props.noteId,
				joinNotesLinksObj: {
					is_added_from_text: false,
					is_in_text: false,
					annotation: formData.annotation || null,
				}
			})

			// Reset data.
			Object.assign(formData, _default_formData)

			emit('close')

		} catch (error) {
			useSnackbar().createSnackbar({ message: 'Error while trying to create new link' })

		} finally {
			isSubmitButtonLoading.value = false
		}
	}
</script>