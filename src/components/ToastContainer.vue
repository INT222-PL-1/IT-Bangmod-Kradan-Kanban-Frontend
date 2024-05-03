<script setup>
import { useToastStore } from '@/stores/toast';
import BaseToast from './BaseToast.vue';

const toastStore = useToastStore()

</script>

<template>
  <Teleport to="#toast">
    <div class="fixed bottom-0 w-full sm:w-auto sm:right-0 z-[60] flex flex-col gap-2 p-4">
      <BaseToast v-for="toast in toastStore.toasts" :key="toast.id" :toastData="toast" />
    </div>
  </Teleport>
</template>

<style scoped></style>