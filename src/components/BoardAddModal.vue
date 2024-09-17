<script setup>
import { computed, ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
// import { useBoardStore } from '@/stores/board';
import { createBoard } from '@/libs/boardManagement';
import { useToastStore } from '@/stores/toast';

const userStore = useUserStore()
const router = useRouter()
// const boardStore = useBoardStore()
const toastStore = useToastStore()

const boardModalData = ref({
  name: `${userStore.user.name} personal board`
})
const disabledSaveButton = computed(() => {
  return boardModalData.value.name.length < 1 ||
    boardModalData.value.name.length > 120
})

const handleClickConfirm = async () => {
  // console.log('Save board', boardModalData.value)
  const res = await createBoard(boardModalData.value)
    if (res.status === 'error') {
      toastStore.createToast({
        title: 'Error',
        description: `There is a problem. Please try again later.`,
        status: 'error'
      })
    } else {
      const createdBoard = res.data
      router.push({ name: 'all-task', params: { boardId: createdBoard.id } })
    }
  // await boardStore.loadAllBoards()
  // router.push({ name: 'all-board' })
}

const handleClickCancel = () => {
  router.push({ name: 'all-board' })
}

</script>

<template>
  <BaseModal
    :show="true" @clickBG="handleClickCancel" :mobileCenter="true">
    <div class="itbkk-modal-new absolute bg-base-300 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
      <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">New Board
      </div>
      <div class="flex flex-col gap-2 p-4 break-words">
        <div class="p-4">
          <div>
            <span class="text-lg font-semibold flex-[0]">
              <span>Board Name </span>
              <span class="text-error">* </span>
              <span class="text-sm">
                ({{ boardModalData.name.length + '/120' }})
              </span>
            </span>
            <span v-show=" boardModalData.name.length > 120"
              class="text-error text-xs">Board name can not be more than 120
              characters</span>
          </div>
          <div :class="{ 'border border-error animate-shake-x-in': boardModalData.name.length > 120 }"
            class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
            <textarea v-model.trim="boardModalData.name" placeholder="Enter Board Name (Required)"
              class="itbkk-board-name break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
          </div>
        </div>
      </div>
      <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
        <div class="flex gap-2">
          <button @click="handleClickConfirm" :class="{ disabled: disabledSaveButton }" class="itbkk-button-ok btn btn-sm btn-success" :disabled="disabledSaveButton">
            Create
          </button>
          <button @click="handleClickCancel" class="itbkk-button-cancel btn btn-sm btn-neutral">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>

</style>