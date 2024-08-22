<script setup>
import IconSVG from './IconSVG.vue';

defineProps({
  type: {
    type: String,
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value),
    default: 'error',
  },
})

</script>

<template>
  <div
    :class="{
      'text-success': type === 'success',
      'text-warning': type === 'warning',
      'text-error': type === 'error',
      'text-info': type === 'info',
    }"
    class="flex justify-center items-center"
  >
    <div class="absolute">
      <IconSVG iconName="dot" scale="3" />
    </div>
    <div class="absolute animate-ping">
      <IconSVG iconName="dot" scale="3" />
    </div>
  </div>
</template>

<style scoped></style>