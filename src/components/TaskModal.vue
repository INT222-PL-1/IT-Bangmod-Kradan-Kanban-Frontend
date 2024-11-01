<script setup>
import { getTimezone, formatDateTime } from '@/libs/utils'
import StatusBadge from './StatusBadge.vue'
import StatusSelector from './StatusSelector.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { createTask, getTaskById, updateTask } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
import { useBoardStore } from '@/stores/board'
import { HttpStatusCode } from 'zyos'
import BigModal from './BigModal.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
})

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
    ) || boardStore.isLoading.microAction
})

async function loadSelectedTaskData() {
  const { taskId, boardId } = route.params
  const res = await getTaskById(taskId, boardId)
  if (res.ok) {
    taskModalData.value = res.data
    if (taskModalMode.value === 'edit') {
      previousTaskData = { ...taskModalData.value, status: { ...taskModalData.value.status } }
    }
  } else {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later' : res.message}.`,
      status: 'error'
    })
    router.replace({ name: 'all-task' })
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
      boardId: route.params.boardId
    }
    return
  } else if (taskModalMode.value === 'edit') {
    await loadSelectedTaskData()
  } else {
    await loadSelectedTaskData()
  }
})

const handleClickClose = () => {
  router.replace({ name: 'all-task' })
}

const handleClickConfirm = async () => {
  if (boardStore.isLoading.microAction) return

  try {
    boardStore.isLoading.microAction = true
    if (taskModalMode.value === 'add') {
      const res = await createTask(taskModalData.value)
      if (res.ok) {
        const createdTask = res.data
        toastStore.createToast({
          title: 'Success',
          description: `The task "${createdTask.title}" is added successfully.`,
          status: 'success'
        })
        router.push({ name: 'all-task' })
      } else {
        toastStore.createToast({
          title: 'Error',
          description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later' : res.message}.`,
          status: 'error'
        })
      }
      await boardStore.loadTasks()
    } else if (taskModalMode.value === 'edit') {
      const res = await updateTask(taskModalData.value)
      if (res.ok) {
        const updatedTask = res.data
        toastStore.createToast({
          title: 'Success',
          description: `The task "${updatedTask.title}" is updated successfully`,
          status: 'success'
        })
        router.push({ name: 'all-task' })
      } else {
        toastStore.createToast({
          title: 'Error',
          description: `An error occurred while updating the task.\nPlease try again later`,
          status: 'error'
        })
      }
      await boardStore.loadTasks()
    }
  } catch (error) {
    console.error(error)
  } finally {
    boardStore.isLoading.microAction = false
  }
}

</script>

<template>
  <BigModal :show="taskModalData !== null" @clickBG="handleClickClose" className="itbkk-modal-task">
    <template #title>
      <span v-if="taskModalMode === 'view'" class="itbkk-title">{{ taskModalData?.title }}</span>
        <span v-else-if="taskModalMode === 'add'">New Task</span>
        <span v-else-if="taskModalMode === 'edit'">Edit Task</span>
    </template>
    <template #content>
      <div v-if="['add', 'edit'].includes(taskModalMode)">
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
      <div class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-4 flex-auto">
        <div>
          <div class="w-full h-full flex flex-col">
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
            <div>
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
            <div>
              <div>
                <span class="text-lg font-semibold">
                  <span>Status </span>
                  <span v-if="['add', 'edit'].includes(taskModalMode)" class="text-sm"
                    :class="boardStore.currentBoard?.isTaskLimitEnabled ? 'text-warning' : 'opacity-50'">
                    (Status limit {{ boardStore.currentBoard?.isTaskLimitEnabled ? 'enabled' : 'disabled' }})
                  </span>
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
    </template>
    <template #actions>
      <button
        v-if="['add', 'edit'].includes(taskModalMode)"
        @click="handleClickConfirm"
        :class="{ 'btn-disabled disabled cursor-not-allowed': disabledSaveButton }"
        class="itbkk-button-confirm btn btn-sm btn-success" :disabled="disabledSaveButton">
        Save
      </button>
      <button v-once @click="handleClickClose" class="itbkk-button itbkk-button-cancel btn btn-sm btn-neutral">
        {{ taskModalMode === 'view' ? 'Close' : 'Cancel' }}
      </button>
    </template>
  </BigModal>
</template>

<style scoped></style>
