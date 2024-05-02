<script setup>
import { getTimezone, formatDateTime } from '@/libs/utils'
import BaseModal from '@/components/BaseModal.vue'
import StatusBadge from './StatusBadge.vue';
import StatusSelector from './StatusSelector.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { createTask, getTaskById } from '@/libs/taskManagement';
import { useToastStore } from '@/stores/toast';
import { useTaskStore } from '@/stores/task';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
})

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const toastStore = useToastStore()
const taskModalMode = ref('view')
const taskModalData = ref(null)

async function fetchTaskData() {
  const taskId = route.params.taskId
  taskModalData.value = await getTaskById(taskId)
  if (taskModalData.value === null) {
    toastStore.createToast({
      title: 'Error',
      description: `Task ${route.params.taskId} not found`,
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
      status: 'NO_STATUS'
    }

    watch(() => taskModalData.value?.title.length, (newVal) => {
      if (newVal > 100) {
        taskModalData.value.title = taskModalData.value?.title.slice(0, 100).trim()
      }
    })

    watch(() => taskModalData.value?.description.length, (newVal) => {
      if (newVal > 500) {
        taskModalData.value.description = taskModalData.value?.description.slice(0, 500).trim()
      }
    })

    watch(() => taskModalData.value?.assignees.length, (newVal) => {
      if (newVal > 30) {
        taskModalData.value.assignees = taskModalData.value?.assignees.slice(0, 30).trim()
      }
    })

    return
  } else if (taskModalMode.value === 'edit') {
    await fetchTaskData()
  } else {
    await fetchTaskData()
  }
})

const handleCLickClose = () => {
  router.replace({ name: 'all-task' })
}

const handleClickConfirm = async () => {
  // if (taskModalData.value.title.length === 0) {
  //   toastStore.createToast({
  //     title: 'Error',
  //     description: 'Title is required',
  //     status: 'error'
  //   })
  //   return
  // }
  const createdTask = await createTask(taskModalData.value)
  if (createdTask === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'Failed to create task',
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: `Task created ${createdTask.title} successfully`,
      status: 'success'
    })
  }
  taskStore.fetchTasks()
  router.push({ name: 'all-task' })
}

</script>

<template>
  <BaseModal :show="taskModalData !== null" @clickBG="handleCLickClose">
    <div
      class="bg-base-100 w-[65rem] max-w-full sm:max-w-[90vw] sm:rounded-xl h-auto lg:h-[40rem] overflow-hidden flex flex-col">
      <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">
        <span v-if="taskModalMode === 'view'" class="itbkk-title">{{ taskModalData?.title }}</span>
        <span v-else-if="taskModalMode === 'add'">New Task</span>
      </div>
      <div v-if="taskModalMode === 'add'" class="p-4">
        <div class="text-lg font-semibold flex-[0]">Title <span class="text-error">*</span> <span
            v-if="taskModalMode === 'add'" class="text-sm">({{
              taskModalData.title.length + '/100'
            }})</span></div>
        <div class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
          <textarea v-model.trim="taskModalData.title" placeholder="Enter Task Title"
            class="itbkk-description break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
        </div>
      </div>
      <div class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 flex-auto">
        <div>
          <div class="p-4 w-full h-full flex flex-col">
            <div class="text-lg font-semibold flex-[0]">Description <span v-if="taskModalMode === 'add'"
                class="text-sm">({{
                  taskModalData.description.length + '/500'
                }})</span></div>
            <div :class="{
              'italic text-[grey] grid place-items-center': !taskModalData?.description,
            }" class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
              <div v-if="taskModalMode === 'view'" class="itbkk-description break-words">
                {{ taskModalData?.description || 'No Description Provided' }}
              </div>
              <textarea v-else-if="taskModalMode === 'add'" v-model="taskModalData.description"
                placeholder="Enter Task Description"
                class="itbkk-description break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <div>
            <div class="p-4">
              <div class="text-lg font-semibold">Assignees <span v-if="taskModalMode === 'add'" class="text-sm">({{
                taskModalData.assignees.length + '/30'
                  }})</span></div>
              <div v-if="taskModalMode === 'view'" :class="{
                'italic text-[grey]': !taskModalData?.assignees,
              }" class="itbkk-assignees">
                {{ taskModalData?.assignees || 'Unassigned' }}
              </div>
              <input v-else-if="taskModalMode === 'add'" v-model="taskModalData.assignees" placeholder="Enter Assignees"
                class="itbkk-assignees w-[20rem] outline-none focus:placeholder:opacity-50 bg-base-200 px-4 py-2 rounded-lg mt-2" />
            </div>
            <div class="p-4">
              <div class="text-lg font-semibold">Status</div>
              <div v-if="taskModalMode === 'view'" class="w-full max-w-[16rem]">
                <StatusBadge :status="taskModalData?.status" class="itbkk-status" />
              </div>
              <div v-else-if="taskModalMode === 'add'" class="w-full max-w-[16rem]">
                <StatusSelector v-model="taskModalData.status" />
              </div>
            </div>
          </div>
          <div v-if="taskModalMode === 'view'">
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
      <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
        <div v-if="taskModalMode === 'view'" class="flex gap-2">
          <button @click="$emit('clickOk')" class="itbkk-button btn btn-sm btn-success">
            Ok
          </button>
          <button @click="handleCLickClose" class="itbkk-button btn btn-sm btn-neutral">
            Close
          </button>
        </div>
        <div v-else-if="taskModalMode === 'add'" class="flex gap-2">
          <button @click="handleClickConfirm"
            :class="{ 'btn-disabled cursor-not-allowed': taskModalData.title.length < 1 }"
            class="itbkk-button-confirm btn btn-sm btn-success" :disabled="taskModalData.title.length < 1">
            Save
          </button>
          <button @click="handleCLickClose" class="itbkk-button-cancel btn btn-sm btn-neutral">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped></style>