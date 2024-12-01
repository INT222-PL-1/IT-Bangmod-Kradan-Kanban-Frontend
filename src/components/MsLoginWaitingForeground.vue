<script setup>
defineEmits(['clickPopup'])

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-show="show" class="fixed inset-0 bg-base-300 bg-opacity-80 z-50 flex flex-col justify-center items-center">
    <div class="text-2xl font-semibold mb-3">Logging in with Microsoft</div>
    <div class="loading text-primary loading-lg loading-dots"></div>
    <div>Pop-up window will appear soon.</div>
    <div>if not, please click <span @click="$emit('clickPopup')" class="text-primary underline">here</span> to open it manually.</div>
  </div>
</template>

<style scoped>

</style>