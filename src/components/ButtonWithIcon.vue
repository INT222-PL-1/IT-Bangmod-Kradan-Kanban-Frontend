<script setup>
import IconSVG from './IconSVG.vue'

defineProps({
  className: {
    type: String
  },
  iconName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div :class="className" class="flex">
    <div class="flex-none">
      <IconSVG :iconName="iconName" />
    </div>
    <div class="flex-auto">
      <slot></slot>
    </div>
  </div>
</template>
