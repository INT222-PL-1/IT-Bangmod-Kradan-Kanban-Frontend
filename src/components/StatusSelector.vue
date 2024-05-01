<script setup>

defineProps({
  status: {
    type: Array,
    default: () => ['NO_STATUS', 'TO_DO', 'DOING', 'DONE'],
    validator: (value) => {
      // No duplicate status
      return new Set(value).size === value.length
    }
  }
})

const model = defineModel()

const statusColor = {
  'DOING': '#f59e0b',
  'DONE': '#10b981',
  'TO_DO': '#ef4444',
  'NO_STATUS': '#6b7280'
}

const statusLabel = {
  'DOING': 'Doing',
  'DONE': 'Done',
  'TO_DO': 'To Do',
  'NO_STATUS': 'No Status'
}

</script>

<template>
  <select v-model="model"
    class="itbkk-status w-full px-2 py-1 rounded-lg grid place-items-center whitespace-nowrap text-white" :style="{
      backgroundColor: statusColor[model]
    }">
    <option :value="status[0]">{{ statusLabel[status[0]] }}</option>
    <option v-for="s in status.slice(1)" :value="s" :key="s">{{ statusLabel[s] }}</option>
  </select>
</template>

<style scoped></style>