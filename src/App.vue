<template>
  <SnackbarContainer />

  <Modal :isOpened="confirmStore.state.isVisible" @close="() => answer(false)" :title="confirmStore.state.title || ''">
    <div v-html="confirmStore.state.question" />

    <template #bottomBar>
      <Button @click="() => answer(false)" buttonType="secondary">Cancel</Button>
      <Button @click="() => answer(true)" buttonType="secondary">Okay</Button>
    </template>
  </Modal>
  
  <router-view/>
</template>

<script setup>
  import { confirmStore } from '@/store/confirmStore'

  // Confirm
  import useConfirm from '@/hooks/useConfirm'
  const { answer } = useConfirm()

  // Modal
  import Modal from '@/components/Modal.vue'
  import Button from '@/components/Button.vue'

  // Snackbar
  import SnackbarContainer from '@/components/helpers/SnackbarContainer.vue'
</script>