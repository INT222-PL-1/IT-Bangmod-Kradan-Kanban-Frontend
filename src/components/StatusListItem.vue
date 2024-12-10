<script setup>
import IconSVG from './IconSVG.vue';
import StatusBadge from './StatusBadge.vue';

const emits = defineEmits(['editClick', 'deleteClick'])

defineProps({
  status: {
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
  },
  isLoading: {
    type: Boolean,
    required: false
  }
})

const handleEditClick = () => {
  emits('editClick')
}

const handleDeleteClick = () => {
  emits('deleteClick')
}

</script>

<template>
  <div class="group bg-base-300 shadow-md rounded-md flex justify-between min-h-[7rem] w-full">
    <div class="flex w-full">
      <div class="h-full min-w-1 sm:min-w-2 transition-[width] rounded-l-[0.25rem]" :style="{ backgroundColor: status.color }" />
      <div class="flex flex-col gap-4 w-full pl-4 pr-6 py-4">
        <div class="flex items-start justify-between w-full ">
          <StatusBadge :statusData="status" />
          <div>{{ status.count }} {{ status.count > 1 ? 'tasks' : 'task' }}</div>
        </div>

        <div class="relative">
          <div class="absolute text-sm bg-neutral rounded-full px-2 translate-x-1">Description</div>
          <div class="rounded-lg bg-base-100 mt-3 pt-3 pb-2 px-3">
            <span v-if="status.description">{{ status.description }}</span>
            <span v-else class="opacity-60 italic">No description</span>
          </div>
        </div>

        <div v-if="!status.isPredefined && hasWritePermission" class="flex gap-2">
          <button @click="handleEditClick" class="btn btn-outline btn-xs active:scale-95 transition" :disabled="isLoading">
            <IconSVG iconName="pencil-square" scale="0.75" />
            Edit
          </button>
          <button @click="handleDeleteClick" class="btn btn-outline btn-xs btn-error cursor-pointer active:scale-95 transition" :disabled="isLoading">
            <IconSVG iconName="trash-fill" scale="0.75" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
