<script setup>
import IconSVG from './IconSVG.vue'

defineProps({
  class: {
    type: String
  },
  iconName: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :class="$props.class" class="flex" :disabled="disabled">
    <div class="flex-none">
      <IconSVG :iconName="iconName" />
    </div>
    <div class="flex-auto">
      <slot></slot>
    </div>
  </button>
</template>
