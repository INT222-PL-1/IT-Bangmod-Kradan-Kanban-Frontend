<script setup>

const emits = defineEmits(['clickBG'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  mobileCenter: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const handleClickBG = (e) => {
  if (props.isLoading) return
  if (e.target === e.currentTarget) emits('clickBG')
}
</script>

<template>
  <div v-if="show" :class="{ 'grid place-items-center': mobileCenter }"
    class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 transition-opacity sm:grid sm:place-items-center overflow-auto"
    @click="handleClickBG">
    <slot></slot>
  </div>
</template>

<style scoped></style>
