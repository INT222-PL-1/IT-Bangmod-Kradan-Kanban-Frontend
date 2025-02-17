<script setup>
import { useBoardStore } from '@/stores/board'
import { useToastStore } from '@/stores/toast'
import { computed, ref, watch } from 'vue'
import StatusBadge from './StatusBadge.vue'
import MiniModal from './MiniModal.vue'
import { HttpStatusCode } from 'zyos'

const emits = defineEmits(['clickClose'])

defineProps({
  show: {
    type: Boolean,
    default: false
  },
})

const boardStore = useBoardStore()
const toastStore = useToastStore()
const newSettings = ref({
  isTaskLimitEnabled: false,
  taskLimitPerStatus: 10
})
const disabledApplySettingsBtn = computed(() => {
  return boardStore.isLoading.board || (
    newSettings.value.isTaskLimitEnabled === boardStore.currentBoard.isTaskLimitEnabled &&
    newSettings.value.taskLimitPerStatus === boardStore.currentBoard.taskLimitPerStatus
  )
})
const exceedLimitOpenState = ref(false)
const exceedLimitStatus = ref([])

const handleApplySetting = async ({ message }) => {
  let res
  try {
    res = await boardStore.updateBoard(boardStore.currentBoard.id, newSettings.value)
    toastStore.createToast({
      title: 'Success',
      description: `The board settings have been updated.\n${message || ''}`,
      status: 'success'
    })
  } catch (error) {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later' : res.message}.`,
      status: 'error'
    })
  }

  if (boardStore.currentBoard.isTaskLimitEnabled && boardStore.currentBoard.exceedLimitStatus.length > 0) {
    exceedLimitStatus.value.push(...boardStore.currentBoard.exceedLimitStatus)
    exceedLimitOpenState.value = true
  }
}

const handleCloseSetting = () => {
  // Reset the settings to the current board settings
  newSettings.value = {
    isTaskLimitEnabled: boardStore.currentBoard.isTaskLimitEnabled,
    taskLimitPerStatus: boardStore.currentBoard.taskLimitPerStatus
  }
  emits('clickClose')
}

const handleCloseExceedLimitModal = () => {
  exceedLimitStatus.value.splice(0, exceedLimitStatus.value.length)
  exceedLimitOpenState.value = false
}

watch(() => boardStore.currentBoard, (newBoard) => {
  newSettings.value = {
    isTaskLimitEnabled: newBoard?.isTaskLimitEnabled,
    taskLimitPerStatus: newBoard?.taskLimitPerStatus
  }
}, { immediate: true })

</script>

<template>
  <MiniModal @clickBG="$emit('clickClose')" :show="show">
    <template #title>
      Board Settings
    </template>
    <template #content>
      <div class="flex-col">
        <div class="font-semibold text-lg underline">Limited Status</div>
        <div class="text-sm">
          Users can limit the number of task in a status by setting the Maximum
          tasks in each status (except "No Status" and "Done" statuses).
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>Limit the number of tasks in this status</div>
        <input v-model="newSettings.isTaskLimitEnabled" class="itbkk-limit-task toggle" type="checkbox">
      </div>
      <div :class="{ 'opacity-50 cursor-not-allowed': newSettings.isTaskLimitEnabled === false }"
        class="flex items-center justify-between">
        <div>Set number of tasks limit</div>
        <input v-model="newSettings.taskLimitPerStatus" class="input input-bordered input-sm w-16" type="number" min="0"
          max="9999" :disabled="newSettings.isTaskLimitEnabled === false" />
      </div>
    </template>
    <template #actions>
      <button @click="handleApplySetting" class="itbkk-button-confirm btn btn-sm btn-success"
        :disabled="disabledApplySettingsBtn">
        Apply
      </button>
      <button @click="handleCloseSetting" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Go back
      </button>
    </template>
  </MiniModal>

  <MiniModal :show="exceedLimitOpenState" @clickBG="handleCloseExceedLimitModal">
    <template #title>
      Status Exceed Limit
    </template>
    <template #content>
      <div>
        These statuses that have reached the task limit. No additional tasks can be added to these statuses at
        this time.
      </div>
      <div class="flex flex-col gap-2">
        <div v-for="status of exceedLimitStatus" :key="status" class="flex items-center gap-2">
          <StatusBadge :statusData="status" textWrapMode="truncate" />
          <div>has <span class="text-error">{{ status.count }}/{{ boardStore.currentBoard.taskLimitPerStatus
              }}</span>
            tasks</div>
          <div class="text-error">({{ status.count - boardStore.currentBoard.taskLimitPerStatus }} task{{
            status.count - boardStore.currentBoard.taskLimitPerStatus > 1 ? 's' : '' }} over limit)</div>
        </div>
      </div>
    </template>
    <template #actions>
      <button @click="handleCloseExceedLimitModal" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Ok
      </button>
    </template>
  </MiniModal>
</template>

<style scoped>
</style>
