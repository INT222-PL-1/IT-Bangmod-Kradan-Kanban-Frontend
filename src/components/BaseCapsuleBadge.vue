<script setup>
import { colorValidator } from '@/libs/utils';
import { computed } from 'vue';

const props = defineProps({
  bgcolor: {
    type: String,
    default: '#555'
  },
  color: {
    type: String,
    default: '#fff'
  },
  width: {
    type: String,
    default: '5rem'
  },
})

const validatedColor = computed(() => {
  return (props.bgcolor && colorValidator(props.bgcolor)) ? props.bgcolor : '#ffffff'
})

</script>

<template>
  <div class="rounded-full cursor-default" :style="{
    border: `1px solid ${validatedColor}`,
    backgroundColor: validatedColor + 11,
    width
  }">
    <div class="my-[0.125rem] flex justify-center items-center" :style="{ width }">
      <div class="max-w-[90%] truncate text-xs"
        :style="{ color: validatedColor }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
