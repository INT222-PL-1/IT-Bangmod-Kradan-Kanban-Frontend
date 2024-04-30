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
  <Transition>
    <div v-show="show"
      class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 pointer-events-none transition-opacity opacity-0 sm:grid sm:place-items-center overflow-auto"
      @click="handleClickBG">
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
