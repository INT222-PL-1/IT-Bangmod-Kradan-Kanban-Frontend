<script setup>
import { humanReadDate } from '@/libs/utils';
import StatusCapsuleBadge from './StatusCapsuleBadge.vue';
import IconSVG from './IconSVG.vue';

defineEmits(['titleClick', 'editClick', 'deleteClick'])

defineProps({
  task: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  hasWritePermission: {
    type: Boolean,
    required: true
  }
})

</script>

<template>
  <div class="w-screen px-4 py-2 flex gap-2">
    <div class="flex-none text-xl">•</div>
    <div class="flex-grow flex flex-col gap-2 overflow-hidden">
      <div class="flex items-baseline justify-between gap-2">
        <div class="flex gap-1 overflow-hidden">
          <div @click="$emit('titleClick')" class="text-xl font-semibold truncate cursor-pointer">{{ task.title }}</div>
          <div class="text-xl opacity-60">{{ '#' + task.id }}</div>
        </div>
        <div v-if="hasWritePermission" class="flex gap-2 bg-base-300 px-2 py-1 rounded-full">
          <div @click="$emit('editClick')" class="cursor-pointer active:scale-95 transition">
            <IconSVG iconName="pencil-square" scale="1" />
          </div>
          <div @click="$emit('deleteClick')" class="text-error cursor-pointer active:scale-95 transition">
            <IconSVG iconName="trash-fill" scale="1" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1 bg-base-200 rounded-lg border-2 border-base-300 p-2">
        <div>
          Assignees:
          <span v-if="task.assignees" class="opacity-60">{{ task.assignees }}</span>
          <span v-else class="opacity-60 italic">Unassigned</span>
        </div>
        <div class="flex gap-2 items-baseline">
          <div>Status:</div>
          <StatusCapsuleBadge :statusData="task.status" />
        </div>
        <div v-show="task.attachmentsCount > 0">
          <span>Attachments: </span>
          <span class="opacity-60">{{ task.attachmentsCount }} files</span>
        </div>
      </div>
      <div class="text-xs font-semibold ml-1">Updated {{ humanReadDate(task.updatedOn) }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>
