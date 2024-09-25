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
    <div class="w-6 h-3 border-2 border-warning-content rounded-full flex items-center">
      <div class="w-[0.45rem] h-[0.45rem] bg-warning-content rounded-full transition" :class="currentValue ? 'translate-x-[calc(1.25rem-0.45rem)]' : 'translate-x-[0.05rem]'"></div>
    </div>
    <div>{{ currentValue ? labelOn : labelOff }}</div>
  </button>
</template>

<style scoped>

</style>