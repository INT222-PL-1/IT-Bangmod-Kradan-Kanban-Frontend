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
  label: {
    type: String,
    default: 'Badge'
  },
  width: {
    type: String,
    default: '8rem'
  },
  description: {
    type: String,
    default: ''
  },
  textWrapMode: {
    type: String,
    default: 'wrap',
    validator: (value) => ['wrap', 'truncate'].includes(value)
  }
})

const validatedColor = computed(() => {
  return (props.bgcolor && colorValidator(props.bgcolor)) ? props.bgcolor : '#ffffff'
})

</script>

<template>
  <div class="rounded-lg cursor-default" :style="{
    border: `1px solid ${validatedColor}`,
    backgroundColor: validatedColor + 11,
    width
  }" :title="description">
    <div class="my-1 flex justify-center items-center" :style="{ width }">
      <div :class="textWrapMode === 'truncate' ? 'truncate' : 'break-words'" class="max-w-[90%]"
        :style="{ color: validatedColor }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>