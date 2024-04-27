<script setup>
import { useToastStore } from '@/stores/toast';
import BaseToast from './BaseToast.vue';

const toastStore = useToastStore()

</script>

<template>
  <Teleport to="#toast">
    <BaseToast v-for="toast in toastStore.toasts" :key="toast.id" :toastData="toast" />
  </Teleport>
</template>

<style scoped></style>