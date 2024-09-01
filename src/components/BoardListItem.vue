<script setup>
defineProps({
  board: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="border-2 border-base-200 bg-base-100 rounded-md p-4 m-4">
    <div class="font-semibold">{{ board.name }}</div>
  </div>
</template>

<style scoped>

</style>