<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { createBoard } from '@/libs/boardManagement';
import { useToastStore } from '@/stores/toast';
import MiniModal from './MiniModal.vue';

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
}

const handleClickCancel = () => {
  router.push({ name: 'all-board' })
}

</script>

<template>
  <MiniModal :show="true" @clickBG="handleClickCancel">
    <template #title>
      New Board
    </template>
    <template #content>
      <div>
        <span class="text-lg font-semibold flex-[0]">
          <span>Board Name </span>
          <span class="text-error">* </span>
          <span class="text-sm">
            ({{ boardModalData.name.length + '/120' }})
          </span>
        </span>
        <span v-show="boardModalData.name.length > 120" class="text-error text-xs">Board name can not be more than
          120
          characters</span>
      </div>
      <div :class="{ 'border border-error animate-shake-x-in': boardModalData.name.length > 120 }"
        class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
        <textarea v-model.trim="boardModalData.name" placeholder="Enter Board Name (Required)"
          class="itbkk-board-name break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
      </div>
    </template>
    <template #actions>
      <button @click="handleClickConfirm" :class="{ disabled: disabledSaveButton }"
        class="itbkk-button-ok btn btn-sm btn-success" :disabled="disabledSaveButton">
        Create
      </button>
      <button @click="handleClickCancel" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Cancel
      </button>
    </template>
  </MiniModal>
</template>

<style scoped>
</style>
