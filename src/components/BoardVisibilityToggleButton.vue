<script setup>
import BoardVisibility from '@/libs/classes/BoardVisibility';
import BaseToggleButton from './BaseToggleButton.vue'
import { useBoardStore } from '@/stores/board';

const boardStore = useBoardStore()

const handleBoardVisibilityClick = () => {
  boardStore.toggleBoardVisibility()
}

</script>

<template>
  <BaseToggleButton @click="" :currentValue="boardStore.currentBoard?.isPublic" :labelOn="BoardVisibility.public" :labelOff="BoardVisibility.private" />
</template>

<style scoped>

</style>