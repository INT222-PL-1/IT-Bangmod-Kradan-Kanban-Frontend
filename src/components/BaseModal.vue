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
    class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 transition-opacity sm:flex sm:flex-col sm:items-center sm:pt-28 overflow-y-auto"
    @mousedown="handleClickBG">
    <slot></slot>
    <div class="min-h-20" />
  </div>
</template>

<style scoped></style>
