<template>
  <SnackbarContainer />
  <ConfirmModal />
  
  <router-view/>
</template>

<script setup>
  import SnackbarContainer from '@/components/helpers/SnackbarContainer.vue'
  import ConfirmModal from '@/components/helpers/ConfirmModal.vue'
</script>