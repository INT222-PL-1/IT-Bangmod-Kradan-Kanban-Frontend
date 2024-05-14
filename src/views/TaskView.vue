<script setup>
import { useTaskStore } from '@/stores/task'
import { onMounted, ref } from 'vue'
// import LoadingModal from '@/components/LoadingModal.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import BaseMenu from '@/components/BaseMenu.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import BaseModal from '@/components/BaseModal.vue'
import { deleteTask } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
import { useStatusStore } from '@/stores/status'
// import { useToastStore } from '@/stores/toast';


const isLoading = ref(false)
const router = useRouter()
const toastStore = useToastStore()
const taskStore = useTaskStore()
const statusStore = useStatusStore()

const taskDeleteModalData = ref(null)
const taskDeleteModalOpenState = ref(false)
// const toastStore = useToastStore()

onMounted(async () => {
  isLoading.value = true
  await taskStore.loadTasks()
  await statusStore.loadStatuses()

  console.log(taskStore.tasks)
  console.log(statusStore.statuses)

  isLoading.value = false
})

const handleTaskClick = (taskId) => {
  router.push({ name: 'task-view', params: { taskId } })
}

const handleRefreshBtnCLick = async () => {
  isLoading.value = true
  await taskStore.loadTasks()
  isLoading.value = false
}

const handleAddBtnCLick = () => {
  router.push({ name: 'task-add' })
}

const handleEditBtnCLick = (taskId) => {
  router.push({ name: 'task-edit', params: { taskId } })
}

const handleOpenDeleteModal = (taskData) => {
  taskDeleteModalData.value = taskData
  taskDeleteModalOpenState.value = true
}

const handleDeleteTask = async (taskId) => {
  const deletedTask = await deleteTask(taskId)
  if (deletedTask?.errorStatus === 404) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, the task does not exist.',
      status: 'error'
    })
    await taskStore.loadTasks()
  } else if (deletedTask === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, please try again later.',
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The task has been deleted',
      status: 'success'
    })
    await taskStore.loadTasks()
  }
  taskDeleteModalOpenState.value = false
}

const handleManageStatusBtnCLick = () => {
  router.push({ name: 'status-manage' })
}

</script>

<template>
  <!-- <LoadingModal :isLoading="isLoading" /> -->

  <Transition>
    <BaseModal @clickBG="taskDeleteModalOpenState = false" :show="taskDeleteModalOpenState" :mobileCenter="true">
      <div class="bg-base-100 w-[30rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Delete Task</div>
        <div class="itbkk-message p-4 break-words">
          Do you want to delete the task number {{ taskDeleteModalData.id }} -
          "<span class="opacity-75 italic">{{ taskDeleteModalData.title }}</span>"?
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="taskDeleteModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
            <button @click="handleDeleteTask(taskDeleteModalData.id)"
              class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <!-- <Teleport to="#header-right">
      <button @click="handleAddBtnCLick" type="button" class="btn btn-primary btn-sm text-neutral">
        <IconSVG iconName="plus" :scale="1.25" />Add Task
      </button>
    </Teleport> -->
  <Teleport to="#navbar-item">
    <div class="flex gap-2">
      <!-- <BaseMenu side="left" class="sm:hidden">
        <template #icon>
          <IconSVG iconName="three-dots" />
        </template>
<template #menu>
          <li>
            <button @click="handleRefreshBtnCLick" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap">
              <div :class="{ 'animate-spin': isLoading }">
                <IconSVG iconName="arrow-clockwise" :scale="1.25" />
              </div>Refresh Tasks
            </button>
          </li>
          <li>
            <button @click="handleManageStatusBtnCLick"
              class="itbkk-manage-status btn btn-sm btn-ghost justify-start flex flex-nowrap">
              <IconSVG iconName="sliders2-vertical" :scale="1.25" />Manage Status
            </button>
          </li>
        </template>
</BaseMenu> -->
      <button @click="handleManageStatusBtnCLick" type="button"
        class="itbkk-manage-status btn btn-outline btn-sm hidden sm:flex">
        <IconSVG iconName="sliders2-vertical" :scale="1.25" />Manage Status
      </button>
      <button @click="handleRefreshBtnCLick" type="button" class="btn btn-secondary btn-sm hidden sm:flex">
        <div :class="{ 'animate-spin': isLoading }">
          <IconSVG iconName="arrow-clockwise" :scale="1.25" />
        </div>Refresh Tasks
      </button>
      <button @click="handleAddBtnCLick" type="button" class="itbkk-button-add btn btn-primary btn-sm text-neutral">
        <IconSVG iconName="plus" :scale="1.25" />Add Task
      </button>
    </div>
  </Teleport>

  <div class="px-4 max-w-full table-overflow-x-scroll py-20">
    <!-- <div class="text-center p-2 text-xl font-semibold">Task Table</div> -->
    <table class="table border border-base-300">
      <thead class="bg-base-200">
        <tr>
          <th class="min-w-16 max-w-16"></th>
          <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">Title</th>
          <th class="min-w-60 max-w-60 sm:min-w-[40vw] sm:max-w-[40vw]">Assignees</th>
          <th class="min-w-44 max-w-44">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="taskStore.tasks === null">
          <td colspan="4" class="text-center">Error while loading tasks from server. Please try again later.</td>
        </tr>
        <tr v-else-if="taskStore.tasks.length === 0">
          <td colspan="4" class="text-center">No task</td>
        </tr>
        <tr v-else v-for="(task, index) in taskStore.tasks" :key="task.id" class="itbkk-item">
          <td class="min-w-16 max-w-16">
            <div class="flex items-center justify-between gap-2">
              <div>{{ index + 1 }}</div>
              <BaseMenu>
                <template #icon>
                  <IconSVG iconName="three-dots-vertical" />
                </template>
                <template #menu>
                  <li>
                    <ButtonWithIcon @click="handleEditBtnCLick(task.id)"
                      className="itbkk-button-edit btn btn-sm btn-ghost justify-start flex flex-nowrap"
                      iconName="pencil-square">
                      Edit
                    </ButtonWithIcon>
                  </li>
                  <li>
                    <ButtonWithIcon @click="handleOpenDeleteModal(task)"
                      className="itbkk-button-delete btn btn-sm btn-ghost justify-start text-error flex flex-nowrap"
                      iconName="trash-fill">
                      Delete
                    </ButtonWithIcon>
                  </li>
                </template>
              </BaseMenu>
            </div>
          </td>
          <td @click="handleTaskClick(task.id)"
            class="overflow-hidden min-w-52 max-w-52 md:max-w-72 lg:max-w-96 hover:underline hover:cursor-pointer">
            <div :class="{ 'itbkk-title': $route.name === 'all-task' }" class="break-words font-semibold">
              {{ task.title }}
            </div>
          </td>
          <td :class="{ 'italic text-[grey]': !task.assignees, 'itbkk-assignees': $route.name === 'all-task' }"
            class="min-w-60 w-60">
            {{ task.assignees || 'Unassigned' }}
          </td>
          <td class="min-w-44 max-w-44">
            <StatusBadge :statusData="statusStore.statuses.find(status => status.id === task.statusId)"
              textWrapMode="truncate" width="100%" :class="{ 'itbkk-status': $route.name === 'all-task' }" />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="h-24"></div> -->
  </div>
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
