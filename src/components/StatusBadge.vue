<script setup>
import { useBoardStore } from '@/stores/board';
import BaseBadge from './BaseBadge.vue';
import { computed } from 'vue';

const props = defineProps({
  statusData: {
    required: true
  },
  showCount: {
    type: Boolean,
    default: false
  },
  showLimit: {
    type: Boolean,
    default: false
  }
})

const boardStore = useBoardStore()

const count = computed(() => {
  return props.showCount ? ` (${props.statusData.count}${props.showLimit && boardStore.board.isLimitTasks ? `/${boardStore.board.taskLimitPerStatus}` : ''})` : ''
})

</script>

<template>
  <BaseBadge :bgcolor="statusData?.color" :description="statusData?.description">
    <div v-if="showCount" class="grid grid-cols-[1fr_auto] gap-1">
      <div class="truncate">{{ statusData?.name }}</div>
      <div>{{ count }}</div>
    </div>
    <span v-else>{{ statusData?.name }}</span>
  </BaseBadge>
</template>

<style scoped></style>
