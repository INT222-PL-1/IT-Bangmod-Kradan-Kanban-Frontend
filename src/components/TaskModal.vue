<script setup>
import { getTimezone, formatDateTime, sumFileSizes } from '@/libs/utils'
import StatusBadge from './StatusBadge.vue'
import StatusSelector from './StatusSelector.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, useId } from 'vue'
import { createTask, getTaskById, updateTask, uploadTaskAttachments } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
import { useBoardStore } from '@/stores/board'
import { HttpStatusCode } from 'zyos'
import BigModal from './BigModal.vue'
import AttachmentDropArea from './AttachmentDropArea.vue'
import IconSVG from './IconSVG.vue'
import AttachmentShowArea from './AttachmentShowArea.vue'
import HoldButton from './HoldButton.vue'
import BaseTooltip from './BaseTooltip.vue'

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

const { taskId, boardId } = route.params

const taskModalMode = ref('view')
const taskModalData = ref(null)

const MAX_FILE_COUNT = 10
const MAX_FILE_SIZE = 20
const fileInputId = useId()
const attachedFiles = ref([])
const eachFileUploadProgress = ref([])
const rawAllFilesSize = computed(() => sumFileSizes(attachedFiles.value) + sumFileSizes(taskModalData.value.attachments))
const allFilesSize = computed(() => {
  return (rawAllFilesSize.value / Math.pow(1024, 2)).toFixed(2)
})
const allFilesCount = computed(() => attachedFiles.value.length + taskModalData.value.attachments.length)

function removeLargeFiles(files) {
  const validFiles = []
  for (const file of files) {
    if (file.size <= MAX_FILE_SIZE * Math.pow(1024, 2)) {
      validFiles.push(file)
    } else {
      continue
    }
  }
  return [validFiles, files.filter(f => !validFiles.includes(f))]
}

function filterValidFiles(files) {
  if (files.length === 0) return []
  const nonDuplicateFiles = files.filter(f => {
    return attachedFiles.value.findIndex(af => af.name === f.name) + taskModalData.value.attachments.findIndex(af => af.name === f.name) === -2
  })

  const [nonLargeFiles, largeFiles] = removeLargeFiles(nonDuplicateFiles)

  const hasLargeFiles = largeFiles.length > 0
  const isFileCountExceed = allFilesCount.value + nonDuplicateFiles.length > MAX_FILE_COUNT

  const validFiles = nonLargeFiles.splice(0, MAX_FILE_COUNT - allFilesCount.value)

  if (isFileCountExceed && !hasLargeFiles) {
    toastStore.createToast({
      title: 'Error',
      description: `Each task can have at most ${MAX_FILE_COUNT} files.\nThe following files are not added: ${nonLargeFiles.map(f => f.name).join(', ')}`,
      status: 'error',
      duration: 10000
    })
  } else if (!isFileCountExceed && hasLargeFiles) {
    toastStore.createToast({
      title: 'Error',
      description: `Each task can have at most ${MAX_FILE_SIZE}MB of files.\nThe following files are not added: ${largeFiles.map(f => f.name).join(', ')}`,
      status: 'error',
      duration: 10000
    })
  } else if (isFileCountExceed && hasLargeFiles) {
    toastStore.createToast({
      title: 'Error',
      description: `Each task can have at most ${MAX_FILE_COUNT} files and ${MAX_FILE_SIZE}MB of files.\nThe following files are not added: ${nonDuplicateFiles.filter(f => !validFiles.includes(f)).map(f => f.name).join(', ')}`,
      status: 'error',
      duration: 10000
    })
  }

  return validFiles
}

const handleFileChange = (e) => {
  let files = []
  if (e instanceof FileList) {
    files = Array.from(e)
  } else {
    files = Array.from(e.target.files)
  }
  if (files.length === 0) return
  const validFiles = filterValidFiles(files)
  attachedFiles.value = [...attachedFiles.value, ...validFiles]
}

const handleClearAttachment = () => {
  attachedFiles.value = []
  taskModalData.value.attachments = []
}

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
        taskModalData.value.status.id === previousTaskData.status.id &&
        attachedFiles.value.length === 0 &&
        taskModalData.value.attachments.length === previousTaskData.attachments.length
      )
    ) || boardStore.isLoading.action
})

async function loadSelectedTaskData() {
  const res = await getTaskById(boardId, taskId)
  if (res.ok) {
    taskModalData.value = res.data
    if (taskModalMode.value === 'edit') {
      previousTaskData = JSON.parse(JSON.stringify(taskModalData.value))
    }
  } else {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later.' : res.message}`,
      status: 'error'
    })
    router.replace({ name: 'all-task' })
  }
}

async function doCreateTask() {
  const res = await createTask(boardId, taskModalData.value)
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
      description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later.' : res.message}`,
      status: 'error'
    })
  }
}

async function doUpdateTask() {
  const res = await updateTask(boardId, taskModalData.value)
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
      description: `An error occurred while updating the task.\nPlease try again later.`,
      status: 'error'
    })
  }
}

async function doUploadAttachments() {
  const res = await uploadTaskAttachments(
    taskModalData.value.id,
    boardStore.currentBoard.id,
    attachedFiles.value,
    (e, file) => {
      if (e.lengthComputable) {
        const percentComplete = e.loaded / e.total * 100
        const fileIndex = attachedFiles.value.indexOf(file)
        eachFileUploadProgress.value[fileIndex] = percentComplete
      }
    }
  )
  attachedFiles.value = []
  if (res.ok) {
    const attachedFileList = res.data
    if (taskModalData.value.attachments && taskModalData.value.attachments.length > 0) {
      attachedFiles.value = []
      taskModalData.value.attachments = [...taskModalData.value.attachments, ...attachedFileList]
    } else {
      attachedFiles.value = []
      taskModalData.value.attachments = attachedFileList
    }
  } else {
    toastStore.createToast({
      title: 'Error',
      description: `An error occurred while uploading attachments.\nPlease try again later.`,
      status: 'error'
    })
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
  if (boardStore.isLoading.action) return

  try {
    boardStore.isLoading.action = true
    if (taskModalMode.value === 'add') {
      await doCreateTask()
      await boardStore.loadTasks(route.params.boardId)
    } else if (taskModalMode.value === 'edit') {
      if (attachedFiles.value.length > 0) {
        await doUploadAttachments()
      }
      await doUpdateTask()
      await boardStore.loadTasks(route.params.boardId)
    }
  } catch (error) {
    console.error(error)
  } finally {
    boardStore.isLoading.action = false
  }
}

</script>

<template>
  <BigModal
    :show="taskModalData !== null"
    @clickBG="handleClickClose"
    class="itbkk-modal-task"
    :isLoading="boardStore.isLoading.action"
  >
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
          <textarea
            v-model.trim="taskModalData.title"
            placeholder="Enter Task Title (Required)"
            class="itbkk-title break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"
            :class="{
              'opacity-50 pointer-events-none cursor-not-allowed': boardStore.isLoading.action
            }"
            :disabled="boardStore.isLoading.action"
          ></textarea>
        </div>
      </div>
      <div class="mt-4 grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-8 flex-auto">
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
              <textarea
                v-else-if="['add', 'edit'].includes(taskModalMode)"
                v-model.trim="taskModalData.description"
                placeholder="Enter Task Description"
                class="itbkk-description break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"
                :class="{
                  'opacity-50 pointer-events-none cursor-not-allowed': boardStore.isLoading.action
                }"
                :disabled="boardStore.isLoading.action"
              >
              </textarea>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between gap-6">
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
              :class="{
                'border border-error animate-shake-x-in': taskModalData.assignees.length > 30,
                'opacity-50 pointer-events-none cursor-not-allowed': boardStore.isLoading.action
              }"
              class="itbkk-assignees w-[20rem] outline-none focus:placeholder:opacity-50 bg-base-200 px-4 py-2 rounded-lg mt-2"
              :disabled="boardStore.isLoading.action"
            />
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
              <StatusSelector v-model="taskModalData.status.id" :disabled="boardStore.isLoading.action" />
            </div>
          </div>
          <div v-if="['view', 'edit'].includes(taskModalMode)">
            <div class=" flex flex-col gap-1">
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
      <div class="mt-6" v-if="['view', 'edit'].includes(taskModalMode)">
        <input
          :id="fileInputId"
          type="file"
          multiple
          @change="handleFileChange"
          class="hidden"
          :disabled="allFilesCount >= MAX_FILE_COUNT || boardStore.isLoading.action"
        />
        <div class="flex flex-col sm:flex-row sm:justify-between gap-2 relative">
          <div class="text-lg font-semibold">
            <span>Attachments </span>
            <!-- <span v-if="['add', 'edit'].includes(taskModalMode)" class="text-sm">
              ({{ taskModalData.assignees.length + '/30' }})
            </span> -->
            <span class="text-sm opacity-50">
              {{ allFilesCount + '/10 files' }} <span>{{ allFilesSize + '/200MB (20MB/file)' }}</span>
            </span>
          </div>
          <div v-if="taskModalMode === 'edit'" class="flex gap-2">
            <label :for="fileInputId" class="btn btn-sm btn-neutral" :class="{ 'btn-disabled': allFilesCount >= MAX_FILE_COUNT || boardStore.isLoading.action }">
              <IconSVG iconName="paperclip" scale="1" size="1rem" />
              <span>Add attachment</span>
            </label>
            <!-- <button type="button" @click="handleClearAttachment" class="btn btn-sm btn-error btn-outline" :disabled="allFilesCount === 0">
              <IconSVG iconName="trash-fill" scale="1" size="1rem" />
              <span>Clear attachment</span>
            </button> -->
            <BaseTooltip text="Click/press and hold to clear all attachments" :disabled="allFilesCount === 0">
              <HoldButton @holdFinish="handleClearAttachment" :duration="2000" color="error" :disabled="allFilesCount === 0 || boardStore.isLoading.action">
                <IconSVG iconName="trash-fill" scale="1" size="1rem" />
                <span>Clear attachment</span>
              </HoldButton>
            </BaseTooltip>
          </div>
          <!-- <span v-if="['add', 'edit'].includes(taskModalMode)" v-show="taskModalData.assignees.length > 30"
            class="text-error text-xs text-nowrap">
            Assignees can not be more than 30 characters
          </span> -->
        </div>

        <!-- ! Attachments Area -->
        <AttachmentDropArea
          v-if="taskModalMode === 'edit'"
          v-model:attached-files="attachedFiles"
          v-model:existing-files="taskModalData.attachments"
          :fileInputId="fileInputId"
          @dropFiles="handleFileChange"
          :disabled="allFilesCount >= MAX_FILE_COUNT || boardStore.isLoading.action"
          :eachFileUploadProgress="eachFileUploadProgress"
        />
        <AttachmentShowArea v-else-if="taskModalMode === 'view'" :existingFiles="taskModalData.attachments" />
      </div>
    </template>
    <template #actions>
      <div v-show="boardStore.isLoading.action" class="loading loading-spinner"></div>
      <button
        v-if="['add', 'edit'].includes(taskModalMode)"
        @click="handleClickConfirm"
        :class="{ 'btn-disabled disabled cursor-not-allowed': disabledSaveButton }"
        class="itbkk-button-confirm btn btn-success" :disabled="disabledSaveButton">
        <!-- {{ attachedFiles.length > 0 ? 'Upload & Save' : 'Save' }} -->
        {{ boardStore.isLoading.action ?
          'Saving...' : 
          attachedFiles.length > 0 ? 'Upload & Save' : 'Save'
        }}
      </button>
      <button v-once @click="handleClickClose" class="itbkk-button itbkk-button-cancel btn btn-neutral" :disabled="boardStore.isLoading.action">
        {{ taskModalMode === 'view' ? 'Close' : 'Cancel' }}
      </button>
    </template>
  </BigModal>
</template>

<style scoped></style>
