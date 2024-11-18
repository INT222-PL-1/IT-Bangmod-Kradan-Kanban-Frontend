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
  class: {
    type: String,
    default: ''
  }
})

const icon = ref('')

const thisIcon = ref(null)

onMounted(async () => {
  try {
    const iconModule = await import(`@/assets/icons/${props.iconName}.svg?raw`)
    icon.value = iconModule.default
  } catch (error) {
    console.error(`Failed to load icon: ${props.iconName}`, error)
  }
})
</script>

<template>
  <div
    :style="{ width: size, height: size }"
    :class="[$props.class]"
    class="inline-grid place-items-center icon-svg"
    ref="thisIcon"
  >
    <div
      v-html="icon"
      :style="{
        transform: `scale(${scale})`,
        color,
      }"
    ></div>
  </div>
</template>

<style scoped>
*[disabled] > .icon-svg {
  opacity: 0.5;
}
</style>
