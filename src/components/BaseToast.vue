<script setup>
import { useToastStore } from '@/stores/toast';
import IconSVG from './IconSVG.vue';

const props = defineProps({
  toastData: {
    type: Object,
    required: true
  }
})

const toastStore = useToastStore()

const toastColor = {
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info'
}

const handleCloseToast = () => {
  toastStore.removeToast(props.toastData.id)
}

</script>

<template>
  <div :class="toastColor[toastData.status]"
    class="w-full max-w-[30rem] animate-pop-in rounded-lg overflow-hidden relative text-white">
    <!-- {{ toastData.id }} -->
    <div @click="handleCloseToast" class="top-4 right-4 absolute cursor-pointer">
      <IconSVG iconName="x" />
    </div>
    <div class="p-4">
      <div class="font-bold">{{ toastData.title }}</div>
      <div class="">{{ toastData.description }}</div>
    </div>
    <div class="h-2 bg-white animate-time-indicator opacity-50"></div>
  </div>
</template>

<style scoped>
.animate-time-indicator {
  animation: time-indicator 5s linear;
}

.animate-pop-in {
  animation: pop-in 0.3s ease;
}

@keyframes time-indicator {
  0% {
    width: 0%;
  }

  100% {
    width: 100%;
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0);
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>