<template>
  <SnackbarContainer />

  <Modal :isOpened="confirmState.isVisible" @close="() => answer(false)" :title="confirmState.title || ''">
    <div v-html="confirmState.question" />

    <template #bottomBar>
      <Button @click="() => answer(false)" buttonType="secondary">Cancel</Button>
      <Button @click="() => answer(true)" buttonType="secondary">Okay</Button>
    </template>
  </Modal>
  
  <router-view/>
</template>

<script setup>
  // Confirm
  import useConfirm from '@/hooks/useConfirm'
  const { confirmState, answer } = useConfirm()

  // Modal
  import Modal from '@/components/Modal.vue'
  import Button from '@/components/Button.vue'

  // Snackbar
  import SnackbarContainer from '@/components/helpers/SnackbarContainer.vue'
</script>