<template>
	<Modal 
    :isOpened="isVisible" 
    :title="title || ''"
    :displayCloseButton="false"
    @close="() => handleAnswerV2({ doReject: true })" 
    @formSubmit="e => handleAnswerV2({ e })"
    isConfirm
    isForm>

    <div v-html="question" />

    <div v-if="inputProps">
      <TextInput :modelValue="inputProps.value || ''" :inputProps="{ ...inputProps, name: 'input', required: true }" />
    </div>

    <template #bottomBar>
      <Button type="button" @click="() => handleAnswerV2({ doReject: true })" buttonType="secondary">Cancel</Button>
      <Button type="submit" buttonType="secondary">Okay</Button>
    </template>
  </Modal>
</template>

<script setup>
  import { ref } from 'vue'
	import useConfirm from '@/hooks/useConfirm'
  import { Button, TextInput, Modal } from '@/components/ui'

  const { isVisible, title, question, inputProps, doAnswer } = useConfirm()

  const formEl = ref(null)

  const handleAnswerV2 = ({ doReject, doResolve, e }) => {
    // Answer directly with boolean if required.
    if (doReject || doResolve)
      return doAnswer(doReject ? false : true)

    // Answer with form data.
    if (!inputProps.value)
      return doAnswer(true)

    // If no boolean set, resolve with form value.
    // Loop inputs (for now, only one. So just return the first value)
    const formData = new FormData(e?.target)
    for (let [ key, value ] of formData.entries()) {
      return doAnswer(value)
    }
  }
</script>