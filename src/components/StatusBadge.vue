<script setup>
import BaseBadge from './BaseBadge.vue';

defineProps({
  statusData: {
    required: true
  }
})

</script>

<template>
  <BaseBadge :bgcolor="statusData?.color" :color="'#fff'" :label="statusData?.name"
    :description="statusData?.description" />
</template>

<style scoped></style>