<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
})

</script>

<template>
  <slot v-if="disabled"></slot>
  <div v-else class="tooltip tooltip-secondary tooltip-top" :class="$props.class" :data-tip="text">
    <slot></slot>
  </div>
</template>

<style scoped>
.tooltip:before  {
  max-width: 13rem;
}
</style>
