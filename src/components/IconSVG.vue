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
  }
})

const icon = ref('')

onMounted(async () => {
  icon.value = (await import(`@/assets/icons/${props.iconName}.svg?raw`)).default
})

</script>

<template>
  <div
    :style="{ width: size, height: size }"
    class="grid place-items-center"
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