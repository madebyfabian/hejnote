<template>
	<Modal 
    :isOpened="isVisible" 
    isConfirm
    @close="() => handleAnswer(false)" 
    :title="title || ''"
    :displayCloseButton="false">

    <div v-html="question" />

    <form v-if="inputProps" @submit.prevent="handleAnswer" ref="formEl">
      <TextInput :modelValue="inputProps.value || ''" :inputProps="inputProps" />
    </form>

    <template #bottomBar>
      <Button @click="() => handleAnswer(false)" buttonType="secondary">Cancel</Button>
      <Button @click="() => handleAnswer(true)" buttonType="secondary">Okay</Button>
    </template>
  </Modal>
</template>

<script setup>
  import { ref } from 'vue'
	import useConfirm from '@/hooks/useConfirm'
  const { isVisible, title, question, inputProps, doAnswer } = useConfirm()
  import Modal from '@/components/Modal.vue'
  import { Button, TextInput } from '@/components/ui'

  const formEl = ref(null)

  const handleAnswer = value => {
    if (value == false)
      return doAnswer(false)

    if (!inputProps.value)
      return doAnswer(value)

    const inputValue = formEl.value.querySelector('input')?.value
    return doAnswer(inputValue)
  }
</script>