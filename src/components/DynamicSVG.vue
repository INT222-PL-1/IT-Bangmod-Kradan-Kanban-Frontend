<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({
  svgName: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 'auto'
  },
  className: {
    type: String,
    default: ''
  },
})

const svg = ref('')

/**
 * @type {HTMLElement}
 */
const thisSvg = ref(null)

onMounted(async () => {
  svg.value = (await import(`@/assets/svgs/${props.svgName}.svg?raw`)).default
})

</script>

<template>
  <div
    :style="{ width: size, height: size }"
    :class="[className]"
    class="grid place-items-center icon-svg"
    ref="thisSvg"
  >
    <div
      v-html="svg"
    ></div>
  </div>
</template>

<style scoped>

*[disabled] > .icon-svg {
  opacity: 0.5;
}

</style>
