<script setup>
import { useStatusStore } from '@/stores/status';

const props = defineProps({
  excludeStatusId: {
    type: Number,
    default: -1,
  },
})

const model = defineModel()

const statusStore = useStatusStore()

const statusList = [...statusStore.statuses]

if (props.excludeStatusId !== -1) {
  statusList.splice(statusList.findIndex(status => status.id === props.excludeStatusId), 1)
}

</script>

<template>
  <select v-model="model"
    class="itbkk-status w-full px-2 py-1 rounded-lg grid place-items-center whitespace-nowrap text-white" :style="{
      backgroundColor: statusList.find(status => status.id === model)?.color,
    }">
    <option v-for="status in statusList" :value="status?.id" :key="status?.id">
      {{ status?.name }}
    </option>
  </select>
</template>
