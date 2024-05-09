<script setup>
import BaseBadge from './BaseBadge.vue';

defineProps({
  statusData: {
    required: true
  }
})

</script>

<template>
  <BaseBadge :bgcolor="statusData?.color" :color="'#fff'"
    :label="statusData?.name !== '' ? statusData.name : 'Status Name'" :description="statusData?.description" />
</template>

<style scoped></style>