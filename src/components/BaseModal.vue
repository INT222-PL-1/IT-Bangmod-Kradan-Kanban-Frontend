<script setup>
import { watch } from 'vue';


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

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>

<template>
  <div v-if="show" :class="{ 'grid place-items-center': mobileCenter }"
    class="fixed inset-0 bg-[#0005] backdrop-blur-sm z-50 transition-opacity sm:grid sm:place-items-center overflow-auto"
    @click="handleClickBG">
    <slot></slot>
  </div>
</template>

<style scoped></style>
