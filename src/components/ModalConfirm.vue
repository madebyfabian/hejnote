<template>
	<Modal 
    :isOpened="isVisible" 
    isConfirm
    @close="() => doAnswer(false)" :title="title || ''"
    :displayCloseButton="false">

    <div v-html="question" />

    <template #bottomBar>
      <Button @click="() => doAnswer(false)" buttonType="secondary">Cancel</Button>
      <Button @click="() => doAnswer(true)" buttonType="secondary">Okay</Button>
    </template>
  </Modal>
</template>

<script setup>
	import useConfirm from '@/hooks/useConfirm'
  const { isVisible, title, question, doAnswer } = useConfirm()
  import Modal from '@/components/Modal.vue'
  import { Button } from '@/components/ui'
</script>