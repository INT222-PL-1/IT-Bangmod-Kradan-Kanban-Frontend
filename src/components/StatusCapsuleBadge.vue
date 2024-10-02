<script setup>
import BaseCapsuleBadge from './BaseCapsuleBadge.vue'

defineProps({
  statusData: {
    required: true
  }
})

</script>

<template>
  <BaseCapsuleBadge :bgcolor="statusData?.color" :description="statusData?.description">
    <span>{{ statusData?.name || 'Status' }}</span>
  </BaseCapsuleBadge>
</template>

<style scoped></style>
