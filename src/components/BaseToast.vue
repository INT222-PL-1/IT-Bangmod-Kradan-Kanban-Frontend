<script setup>

defineProps({
  toastData: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div>
    {{ toastData }}
  </div>
</template>

<style scoped></style>