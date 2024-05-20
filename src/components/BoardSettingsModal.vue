<script setup>
import { useBoardStore } from '@/stores/board';
import BaseModal from './BaseModal.vue'
import { useToastStore } from '@/stores/toast';
import { computed, ref, watch } from 'vue';
import { patchBoard } from '@/libs/boardManagement';
import StatusBadge from './StatusBadge.vue';

defineEmits(['clickClose'])

defineProps({
  show: {
    type: Boolean,
    default: false
  },
})

const boardStore = useBoardStore()
const toastStore = useToastStore()
const newSettings = ref(null)
const disabledSaveSettingsBtn = computed(() => {
  return newSettings.value.isLimitTasks === boardStore.board.isLimitTasks &&
    newSettings.value.taskLimitPerStatus === boardStore.board.taskLimitPerStatus
})
const confirmLimitOpenState = ref(false)
const exceedLimitOpenState = ref(false)
const exceedLimitStatus = ref([])

const handleSaveSettingsStatus = async ({ message }) => {
  const responseObj = await patchBoard(boardStore.board.id, newSettings.value)
  if (responseObj.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${responseObj.message}.`,
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: `The board settings have been updated.\n${message || ''}`,
      status: 'success'
    })
    await boardStore.fetchBoard()
  }

  const patchedBoard = responseObj.data

  if (patchedBoard.isLimitTasks && patchedBoard.exceedLimitStatus.length > 0) {
    exceedLimitStatus.value.push(...patchedBoard.exceedLimitStatus)
    exceedLimitOpenState.value = true
  }
}

const handleConfirmLimit = async () => {
  await handleSaveSettingsStatus({
    message: newSettings.value.isLimitTasks ? `The Kanban board now limits ${newSettings.value.taskLimitPerStatus} tasks in each status.` : 'The Kanban board has disabled the task limit in each status.'
  })
  confirmLimitOpenState.value = false
}

const handleCancelConfirmLimit = () => {
  console.log('newSettings.value.isLimitTasks', newSettings.value.isLimitTasks)
  newSettings.value.isLimitTasks = !newSettings.value.isLimitTasks
  confirmLimitOpenState.value = false
}

const handleCloseExceedLimitModal = () => {
  exceedLimitStatus.value.splice(0, exceedLimitStatus.value.length)
  exceedLimitOpenState.value = false
}

watch(() => newSettings.value?.isLimitTasks, (newVal) => {
  if (newVal !== boardStore.board.isLimitTasks) {
    confirmLimitOpenState.value = true
  }
})

watch(() => boardStore.board, (newBoard) => {
  newSettings.value = { ...newBoard }
}, { immediate: true })

</script>

<template>
  <Transition>
    <BaseModal @clickBG="$emit('clickClose')" :show="show" :mobileCenter="true">
      <div class="absolute bg-base-100 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Board Settings</div>
        <div class="flex flex-col gap-2 p-4 break-words">
          <div class="flex flex-col gap-2">
            <div class="flex-col">
              <div class="font-semibold text-lg underline">Limited Status</div>
              <div class="text-secondary text-sm">
                Users can limit the number of task in a status by setting the Maximum
                tasks in each status (except "No Status" and "Done" statuses).
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>Limit the number of tasks in this status</div>
              <input v-model="newSettings.isLimitTasks" class="toggle" type="checkbox">
            </div>
            <div :class="{ 'opacity-50 cursor-not-allowed': newSettings.isLimitTasks === false }"
              class="flex items-center justify-between">
              <div>Set number of tasks limit</div>
              <input v-model="newSettings.taskLimitPerStatus" class="input input-bordered input-sm w-16" type="number"
                min="0" max="9999" :disabled="newSettings.isLimitTasks === false" />
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="handleSaveSettingsStatus" class="itbkk-button-confirm btn btn-sm btn-success"
              :disabled="disabledSaveSettingsBtn">
              Apply
            </button>
            <button @click="$emit('clickClose')" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Go back
            </button>
          </div>
        </div>
      </div>
      <Transition>
        <BaseModal :show="confirmLimitOpenState" @clickBG="handleCancelConfirmLimit" :mobileCenter="true">
          <div class="absolute bg-base-100 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
            <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Confirm {{
              newSettings.isLimitTasks ? 'Enable' : 'Disable' }} Limit</div>
            <div v-show="newSettings.isLimitTasks" class="flex flex-col gap-2 p-4 break-words">
              The Kanban board will limit the number of tasks in each status to {{ newSettings.taskLimitPerStatus }}.
            </div>
            <div v-show="!newSettings.isLimitTasks" class="flex flex-col gap-2 p-4 break-words">
              The Kanban board will disable the task limit in each status.
            </div>
            <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
              <div class="flex gap-2">
                <button @click="handleConfirmLimit" class="itbkk-button-confirm btn btn-sm btn-success">
                  Confirm
                </button>
                <button @click="handleCancelConfirmLimit" class="itbkk-button-cancel btn btn-sm btn-neutral">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </BaseModal>
      </Transition>
      <Transition>
        <BaseModal :show="exceedLimitOpenState" @clickBG="handleCloseExceedLimitModal" :mobileCenter="true">
          <div class="absolute bg-base-100 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
            <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Status Exceed Limit
            </div>
            <div class="flex flex-col gap-2 p-4 break-words">
              <div>
                These statuses that have reached the task limit. No additional tasks can be added to these statuses at
                this time.
              </div>
              <div class="flex flex-col gap-2">
                <div v-for="status of exceedLimitStatus" :key="status" class="flex items-center gap-2">
                  <StatusBadge :statusData="status" textWrapMode="truncate" />
                  <div>has <span class="text-error">{{ status.count }}/{{ boardStore.board.taskLimitPerStatus }}</span>
                    tasks</div>
                  <div class="text-error">({{ status.count - boardStore.board.taskLimitPerStatus }} task{{
                    status.count - boardStore.board.taskLimitPerStatus > 1 ? 's' : '' }} over limit)</div>
                </div>
              </div>
            </div>
            <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
              <div class="flex gap-2">
                <button @click="handleCloseExceedLimitModal" class="itbkk-button-cancel btn btn-sm btn-neutral">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </BaseModal>
      </Transition>
    </BaseModal>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
