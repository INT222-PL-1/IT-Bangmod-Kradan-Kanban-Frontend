<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <BaseModal :show="isLoading">
    <div>
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </BaseModal>
</template>

<style scoped></style>