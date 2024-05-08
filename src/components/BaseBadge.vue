<script setup>
defineProps({
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
</script>

<template>
  <div class="w-full px-2 py-1 rounded-lg cursor-default" :style="{
    backgroundColor: bgcolor,
    color,
    width
  }" :title="label">
    <div :class="textWrapMode === 'truncate' ? 'truncate' : 'break-words'" class="text-center w-full">{{ label }}</div>
  </div>
</template>

<style scoped></style>