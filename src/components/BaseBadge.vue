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
  }
})
</script>

<template>
  <div class="w-fit px-2 py-1 rounded-lg grid place-items-center whitespace-nowrap" :style="{
    backgroundColor: bgcolor,
    color
  }">
    {{ label }}
  </div>
</template>

<style scoped></style>