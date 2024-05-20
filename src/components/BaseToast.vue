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
    class="w-full sm:min-w-[24rem] max-w-[30rem] animate-pop-in rounded-lg overflow-hidden relative text-white">
    <div @click="handleCloseToast" class="top-4 right-4 absolute cursor-pointer">
      <IconSVG iconName="x" />
    </div>
    <div class="p-4">
      <div class="font-bold">{{ toastData.title }}</div>
      <div class="itbkk-message break-words">
        <div v-for="(description, index) of toastData.description.split('\n')" :key="index">{{ description }}</div>
      </div>
    </div>
    <div class="h-2 bg-white animate-time-indicator opacity-50"></div>
  </div>
</template>

<style scoped>
.animate-time-indicator {
  animation: time-indicator 5s linear forwards;
}

/* .animate-pop-in {
  animation: pop-in 0.3s ease;
} */

@keyframes time-indicator {
  from {
    width: 100%;
  }

  to {
    width: 0%;
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
