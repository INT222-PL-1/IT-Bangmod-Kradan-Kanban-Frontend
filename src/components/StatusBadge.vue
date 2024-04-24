<script setup>
import BaseBadge from './BaseBadge.vue';

defineProps({
  status: {
    type: String,
    default: 'No Status'
  }
})

const statusColor = {
  'DOING': '#f59e0b',
  'DONE': '#10b981',
  'TO_DO': '#ef4444',
  'No Status': '#6b7280'
}

// const statusLabelColor = {
//   'DOING': '#f59e0b',
//   'DONE': '#10b981',
//   'TO_DO': '#ef4444',
//   'No Status': '#6b7280'
// }

const statusLabel = {
  'DOING': 'Doing',
  'DONE': 'Done',
  'TO_DO': 'To Do',
  'NO_STATUS': 'No Status'
}


</script>

<template>
  <BaseBadge :bgcolor="statusColor[status]" :color="'#fff'" :label="statusLabel[status]" />
</template>

<style scoped></style>