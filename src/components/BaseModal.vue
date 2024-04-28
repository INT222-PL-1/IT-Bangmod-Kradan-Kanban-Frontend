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
  <Teleport to="#modal">
    <div :class="{
      'opacity-100 pointer-events-auto': show
    }"
      class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 pointer-events-none transition-opacity opacity-0 grid place-items-center"
      @click="handleClickBG">
      <slot></slot>
    </div>
  </Teleport>
</template>

<style scoped></style>
