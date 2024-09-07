<script setup>
import IconSVG from './IconSVG.vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 1
  },
})

const handleCopyBoard = () => {
  navigator.clipboard.writeText(props.text)
}
</script>

<template>
  <button @click="handleCopyBoard" class="btn btn-ghost btn-sm btn-square">
    <IconSVG iconName="copy" :scale="size" :size="`${size}rem`" />
  </button>
</template>

<style scoped>

</style>