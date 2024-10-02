<script setup>
import BoardVisibility from '@/libs/classes/BoardVisibility';
import BaseToggleButton from './BaseToggleButton.vue'
import { useBoardStore } from '@/stores/board';

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})

const boardStore = useBoardStore()

</script>

<template>
  <BaseToggleButton :className="className" colorTypeOff="base" colorTypeOn="warning" :currentValue="boardStore.currentBoard?.isPublic" :labelOn="BoardVisibility.public" :labelOff="BoardVisibility.private" :disabled="disabled" />
</template>

<style scoped>

</style>
