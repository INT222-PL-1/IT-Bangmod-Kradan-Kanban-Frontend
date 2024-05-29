<script setup>
import { getTimezone, formatDateTime } from '@/libs/utils'
import BaseModal from '@/components/BaseModal.vue'
import StatusBadge from './StatusBadge.vue'
import StatusSelector from './StatusSelector.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { createTask, getTaskById, updateTask } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
import { useBoardStore } from '@/stores/board'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
})

const BOARD_ID = import.meta.env.VITE_BOARD_ID
const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const toastStore = useToastStore()

const taskModalMode = ref('view')
const taskModalData = ref(null)
let previousTaskData = null
const disabledSaveButton = computed(() => {
  return taskModalData.value.title.length < 1 ||
    taskModalData.value.title.length > 100 ||
    taskModalData.value.description.length > 500 ||
    taskModalData.value.assignees.length > 30 ||
    (
      taskModalMode.value === 'edit' &&
      (
        taskModalData.value.title === previousTaskData.title &&
        taskModalData.value.description === previousTaskData.description &&
        taskModalData.value.assignees === previousTaskData.assignees &&
        taskModalData.value.status.id === previousTaskData.status.id
      )
    )
})

async function fetchTaskData() {
  const taskId = route.params.taskId
  const responseObj = await getTaskById(taskId)
  if (responseObj.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${responseObj.message}`,
      status: 'error'
    })
    router.replace({ name: 'all-task' })
  } else {
    taskModalData.value = responseObj.data
    if (taskModalMode.value === 'edit') {
      previousTaskData = { ...taskModalData.value, status: { ...taskModalData.value.status } }
    }
  }
}

onMounted(async () => {
  taskModalMode.value = route.name.split('-').pop()
  if (taskModalMode.value === 'add') {
    taskModalData.value = {
      title: '',
      description: '',
      assignees: '',
      status: {
        id: 1
      },
      boardId: BOARD_ID
    }
    return
  } else if (taskModalMode.value === 'edit') {
    await fetchTaskData()
  } else {
    await fetchTaskData()
  }
})

const handleClickClose = () => {
  router.replace({ name: 'all-task' })
}

const handleClickConfirm = async () => {
  if (taskModalMode.value === 'add') {
    const responseObj = await createTask(taskModalData.value)
    if (responseObj.status === 'error') {
      toastStore.createToast({
        title: 'Error',
        description: `An error occurred while adding the task.\n${responseObj.message}`,
        status: 'error'
      })
    } else {
      const createdTask = responseObj.data
      toastStore.createToast({
        title: 'Success',
        description: `The task "${createdTask.title}" is added successfully.`,
        status: 'success'
      })
    }
    await boardStore.fetchTasks()
    router.push({ name: 'all-task' })
  } else if (taskModalMode.value === 'edit') {
    const responseObj = await updateTask(taskModalData.value)
    if (responseObj.status === 'error') {
      toastStore.createToast({
        title: 'Error',
        description: `An error occurred while updating the task.\n${responseObj.message}`,
        status: 'error'
      })
    } else {
      const updatedTask = responseObj.data
      toastStore.createToast({
        title: 'Success',
        description: `The task "${updatedTask.title}" is updated successfully`,
        status: 'success'
      })
    }
    await boardStore.fetchTasks()
    router.push({ name: 'all-task' })
  }
}

</script>

<template>
  <BaseModal :show="taskModalData !== null" @clickBG="handleClickClose">
    <div class="itbkk-modal-task bg-base-100 w-[65rem] max-w-full sm:max-w-[90vw] sm:rounded-xl h-auto flex flex-col">
      <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">
        <span v-if="taskModalMode === 'view'" class="itbkk-title">{{ taskModalData?.title }}</span>
        <span v-else-if="taskModalMode === 'add'">New Task</span>
        <span v-else-if="taskModalMode === 'edit'">Edit Task</span>
      </div>
      <div v-if="['add', 'edit'].includes(taskModalMode)" class="p-4">
        <div>
          <span class="text-lg font-semibold flex-[0]">
            <span>Title </span>
            <span class="text-error">* </span>
            <span v-if="['add', 'edit'].includes(taskModalMode)" class="text-sm">
              ({{ taskModalData.title.length + '/100' }})
            </span>
          </span>
          <span v-if="['add', 'edit'].includes(taskModalMode)" v-show="taskModalData.title.length > 100"
            class="text-error text-xs">Title can not be more than 100
            characters</span>
        </div>
        <div :class="{ 'border border-error animate-shake-x-in': taskModalData.title.length > 100 }"
          class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
          <textarea v-model.trim="taskModalData.title" placeholder="Enter Task Title (Required)"
            class="itbkk-title break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
        </div>
      </div>
      <div class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 flex-auto">
        <div>
          <div class="p-4 w-full h-full flex flex-col">
            <div class="flex-[0]">
              <span class="text-lg font-semibold ">
                <span>Description</span>
                <span v-if="['add', 'edit'].includes(taskModalMode)" class="text-sm">
                  ({{ taskModalData.description.length + '/500' }})
                </span>
              </span>
              <span v-if="['add', 'edit'].includes(taskModalMode)" v-show="taskModalData.description.length > 500"
                class="text-error text-xs">
                Description can not be more than 500 characters
              </span>
            </div>
            <div :class="{
              'border border-error animate-shake-x-in': taskModalData.description?.length > 500,
              'italic text-[grey] grid place-items-center': !taskModalData?.description,
            }" class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
              <div v-if="taskModalMode === 'view'" class="itbkk-description break-words">
                {{ taskModalData?.description || 'No Description Provided' }}
              </div>
              <textarea v-else-if="['add', 'edit'].includes(taskModalMode)" v-model.trim="taskModalData.description"
                placeholder="Enter Task Description"
                class="itbkk-description break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <div>
            <div class="p-4">
              <div>
                <span class="text-lg font-semibold">
                  <span>Assignees </span>
                  <span v-if="['add', 'edit'].includes(taskModalMode)" class="text-sm">
                    ({{ taskModalData.assignees.length + '/30' }})
                  </span>
                </span>
                <span v-if="['add', 'edit'].includes(taskModalMode)" v-show="taskModalData.assignees.length > 30"
                  class="text-error text-xs text-nowrap">
                  Assignees can not be more than 30 characters
                </span>
              </div>
              <div v-if="taskModalMode === 'view'" :class="{
                'italic text-[grey]': !taskModalData?.assignees,
              }" class="itbkk-assignees">
                {{ taskModalData?.assignees || 'Unassigned' }}
              </div>
              <input v-else-if="['add', 'edit'].includes(taskModalMode)" v-model.trim="taskModalData.assignees"
                placeholder="Enter Assignees"
                :class="{ 'border border-error animate-shake-x-in': taskModalData.assignees.length > 30 }"
                class="itbkk-assignees w-[20rem] outline-none focus:placeholder:opacity-50 bg-base-200 px-4 py-2 rounded-lg mt-2" />
            </div>
            <div class="p-4">
              <div>
                <span class="text-lg font-semibold">
                  <span>Status </span>
                  <span v-if="['add', 'edit'].includes(taskModalMode)" class="text-sm"
                    :class="boardStore.board.isLimitTasks ? 'text-warning' : 'opacity-50'">
                    (Status limit {{ boardStore.board.isLimitTasks ? 'enabled' : 'disabled' }})
                  </span>
                </span>
                <span v-if="['add', 'edit'].includes(taskModalMode)" v-show="taskModalData.assignees.length > 30"
                  class="text-error text-xs text-nowrap">
                  Assignees can not be more than 30 characters
                </span>
              </div>
              <div v-if="taskModalMode === 'view'" class="w-full max-w-[16rem]">
                <StatusBadge :statusData="taskModalData?.status" textWrapMode="wrap" width="100%"
                  class="itbkk-status" />
              </div>
              <div v-else-if="['add', 'edit'].includes(taskModalMode)" class="w-full max-w-[16rem] mt-2">
                <StatusSelector v-model="taskModalData.status.id" />
              </div>
            </div>
          </div>
          <div v-if="['view', 'edit'].includes(taskModalMode)">
            <div class="p-4 flex flex-col gap-1">
              <!-- <div class="text-lg font-bold">Timezone</div> -->
              <div class="flex">
                <div class="flex-[2] font-semibold">Timezone</div>
                <div class="itbkk-timezone flex-[3] text-sm bg-base-200 rounded-lg px-2">
                  {{ getTimezone() }}
                </div>
              </div>
              <div class="flex">
                <div class="flex-[2] font-semibold">Created On</div>
                <div class="itbkk-created-on flex-[3] text-sm bg-base-200 rounded-lg px-2">
                  {{ formatDateTime(taskModalData?.createdOn) }}
                </div>
              </div>
              <div class="flex">
                <div class="flex-[2] font-semibold">Updated On</div>
                <div class="itbkk-updated-on flex-[3] text-sm bg-base-200 rounded-lg px-2">
                  {{ formatDateTime(taskModalData?.updatedOn) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200 rounded-b-lg">
        <div v-if="taskModalMode === 'view'" class="flex gap-2">
          <button @click="handleClickClose" class="itbkk-button btn btn-sm btn-neutral">
            Close
          </button>
        </div>
        <div v-else-if="['add', 'edit'].includes(taskModalMode)" class="flex gap-2">
          <button @click="handleClickConfirm"
            :class="{ 'btn-disabled disabled cursor-not-allowed': disabledSaveButton }"
            class="itbkk-button-confirm btn btn-sm btn-success" :disabled="disabledSaveButton">
            Save
          </button>
          <button @click="handleClickClose" class="itbkk-button-cancel btn btn-sm btn-neutral">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped></style>
