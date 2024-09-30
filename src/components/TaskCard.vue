<script setup>
import StatusCapsuleBadge from './StatusCapsuleBadge.vue';


defineProps({
  task: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <!-- <div>
    {{ task }}
  </div> -->
  <div class="w-screen px-4 py-2 flex gap-2">
    <div class="flex-none text-xl">•</div>
    <div class="flex-grow flex flex-col gap-2 overflow-hidden">
      <div class="flex gap-1">
        <div class="text-xl font-semibold truncate cursor-pointer">{{ task.title }}</div>
        <div class="text-xl opacity-60">{{ '#' + task.id }}</div>
      </div>
      
      <div class="bg-base-200 rounded-lg border-2 border-base-300 p-2">
        <div v-show="task.assignees">Assignees: <span class="opacity-60">{{ task.assignees }}</span></div>
        <div class="flex gap-2 items-baseline">
          <div>Status:</div>
          <StatusCapsuleBadge :statusData="task.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>