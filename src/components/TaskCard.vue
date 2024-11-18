<script setup>
import { humanReadDate } from '@/libs/utils';
import StatusCapsuleBadge from './StatusCapsuleBadge.vue';
import IconSVG from './IconSVG.vue';

const emits = defineEmits(['titleClick', 'editClick', 'deleteClick'])

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

const handleEditClick = (e) => {
  e.stopPropagation()
  emits('editClick')
}

const handleDeleteClick = (e) => {
  e.stopPropagation()
  emits('deleteClick')
}

</script>

<template>
  <div @click="$emit('titleClick')" class="w-screen px-4 pt-4 pb-8 flex gap-2 border-b-2 border-base-300 cursor-pointer">
    <div class="flex-none text-xl">•</div>
    <div class="flex-grow flex flex-col gap-2 overflow-hidden">
      <div class="flex items-baseline justify-between gap-2">
        <div class="flex gap-1 overflow-hidden">
          <div class="text-xl font-semibold truncate">{{ task.title }}</div>
          <div class="text-xl opacity-60">{{ '#' + task.id }}</div>
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
      <div v-if="hasWritePermission" class="mt-2 flex gap-2">
        <button @click="handleEditClick" class="btn btn-outline btn-sm active:scale-95 transition">
          <IconSVG iconName="pencil-square" scale="1" />
          Edit
        </button>
        <button @click="handleDeleteClick" class="btn btn-outline btn-sm btn-error cursor-pointer active:scale-95 transition">
          <IconSVG iconName="trash-fill" scale="1" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
