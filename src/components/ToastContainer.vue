<script setup>
import { useToastStore } from '@/stores/toast';
import BaseToast from './BaseToast.vue';

const toastStore = useToastStore()

</script>

<template>
  <Teleport to="#toast">
    <div :class="{ 'pointer-events-none': toastStore.toasts.length < 1 }"
      class="fixed bottom-0 w-full sm:w-auto sm:right-0 z-[60] flex flex-col gap-2 px-4 pb-4">
      <TransitionGroup>
        <BaseToast v-for="toast in toastStore.toasts" :key="toast.id" :toastData="toast" />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.5s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(110%);
}
</style>
