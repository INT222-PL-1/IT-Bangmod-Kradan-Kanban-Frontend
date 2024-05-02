<script setup>
import IconSVG from './IconSVG.vue'

defineProps({
  className: {
    type: String
  },
  iconName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div :class="className">
    <IconSVG :iconName="iconName" />
    <div>{{ text }}</div>
  </div>
</template>