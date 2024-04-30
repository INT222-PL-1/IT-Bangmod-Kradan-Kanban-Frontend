<script setup>

const emits = defineEmits(['clickBG'])

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const handleClickBG = (e) => {
  if (e.target === e.currentTarget) emits('clickBG')
}
</script>

<template>
  <div v-show="show"
    class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 transition-opacity sm:grid sm:place-items-center overflow-auto"
    @click="handleClickBG">
    <slot></slot>
  </div>
</template>

<style scoped></style>
