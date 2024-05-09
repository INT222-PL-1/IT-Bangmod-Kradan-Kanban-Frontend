<script setup>
import { useStatusStore } from '@/stores/status';

const model = defineModel()

const statusStore = useStatusStore()

</script>

<template>
  <select v-model="model"
    class="itbkk-status w-full px-2 py-1 rounded-lg grid place-items-center whitespace-nowrap text-white" :style="{
      backgroundColor: statusStore.statuses.find(status => status.id === model)?.color,
    }">
    <option v-for="status in statusStore.statuses" :value="status?.id" :key="status?.id">
      {{ status?.name }}
    </option>
  </select>
</template>
