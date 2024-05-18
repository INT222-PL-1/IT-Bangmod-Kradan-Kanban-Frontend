<script setup>
import { useStatusStore } from '@/stores/status';
import { onMounted } from 'vue';
import StatusSelector from './StatusSelector.vue';

  const statusStore = useStatusStore

  onMounted(async () => {
  await statusStore.loadStatuses()
})
</script>

<template>
<div class="text-lg font-semibold">Status</div>
  <div v-if="taskModalMode === 'view'" class="w-full max-w-[16rem]">
    <StatusBadge :statusData="taskModalData?.status" textWrapMode="wrap" width="100%"
      class="itbkk-status" />
  </div>
  <div v-else-if="['add', 'edit'].includes(taskModalMode)" class="w-full max-w-[16rem]">
    <StatusSelector v-model="taskModalData.status.id" />
  </div>

  <StatusBadge class="cursor-pointer" :statusData="statusList.find(status => status.id === model)"
            textWrapMode="wrap" width="10rem" />
          <IconSVG iconName="chevron-down" size="2rem" />
</template>