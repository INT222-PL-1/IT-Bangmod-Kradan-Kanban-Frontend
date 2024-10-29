<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  color: String,
  scale: {
    type: [Number, String],
    default: 1
  },
  size: {
    type: [Number, String],
    default: '1rem'
  },
  className: {
    type: String,
    default: ''
  }
})

const icon = ref('')

/**
 * @type {HTMLElement}
 */
const thisIcon = ref(null)

onMounted(async () => {
  icon.value = (await import(`@/assets/icons/${props.iconName}.svg?raw`)).default
})

</script>

<template>
  <div
    :style="{ width: size, height: size }"
    :class="[className]"
    class="grid place-items-center icon-svg"
    ref="thisIcon"
  >
    <div
      v-html="icon"
      :style="{
        color,
        transform: `scale(${scale})`
      }"
    ></div>
  </div>
</template>

<style scoped>

*[disabled] > .icon-svg {
  opacity: 0.5;
}

</style>
