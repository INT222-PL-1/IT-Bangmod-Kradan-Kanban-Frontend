<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <Teleport to="#modal">
    <div
      :class="{
        'opacity-100 pointer-events-auto': show
      }"
      class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 pointer-events-none transition-opacity opacity-0 grid place-items-center"
    >
      <slot></slot>
    </div>
  </Teleport>
</template>

<style scoped></style>
