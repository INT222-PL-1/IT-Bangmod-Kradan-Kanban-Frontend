<script setup>
import { useBoardStore } from '@/stores/board';
import BaseModal from './BaseModal.vue'
import { useToastStore } from '@/stores/toast';
import { computed, ref, watch } from 'vue';
import { patchBoard } from '@/libs/boardManagement';

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

const handleSaveSettingsStatus = async () => {
  const patchedBoard = await patchBoard(boardStore.board.id, newSettings.value)
  if (patchedBoard === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, please try again later.',
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The board settings have been updated.',
      status: 'success'
    })
    await boardStore.fetchBoard()
  }
  // emits('clickClose')
}

watch(() => boardStore.board, (newBoard) => {
  newSettings.value = { ...newBoard }
}, { immediate: true })

</script>

<template>
  <Transition>
    <BaseModal @clickBG="$emit('clickClose')" :show="show" :mobileCenter="true">
      <div class="bg-base-100 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Status Settings</div>
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
    </BaseModal>
  </Transition>
</template>

<style scoped></style>
