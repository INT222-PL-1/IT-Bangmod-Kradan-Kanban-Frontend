<script setup>
defineProps({
  currentValue: {
    type: Boolean,
    default: false,
  },
  labelOn: {
    type: String,
    default: 'On',
  },
  labelOff:{
    type: String,
    default: 'Off',
  }
})

</script>

<template>
  <button class="btn btn-warning btn-sm">
    {{ currentValue ? labelOn : labelOff }}
  </button>
</template>

<style scoped>

</style>