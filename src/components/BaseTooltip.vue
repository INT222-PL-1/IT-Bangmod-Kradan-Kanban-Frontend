<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})

</script>

<template>
  <div class="tooltip tooltip-secondary tooltip-top" :data-tip="text">
    <slot></slot>
  </div>
</template>

<style scoped>

</style>
