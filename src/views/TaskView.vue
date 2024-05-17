<script setup>
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
import SortButton from '@/components/SortButton.vue'
import { useBoardStore } from '@/stores/board'

const router = useRouter()
const toastStore = useToastStore()
const boardStore = useBoardStore()
const taskDeleteModalData = ref(null)
const taskDeleteModalOpenState = ref(false)

async function fetchTasks() {
  await boardStore.fetchTasks()
}

onMounted(async () => {
  await fetchTasks()
})

const handleRefreshBtnCLick = async () => {
  await fetchTasks()
}

const handleTaskClick = (taskId) => {
  router.push({ name: 'task-view', params: { taskId } })
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
    await fetchTasks()
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
    await fetchTasks()
  }
  taskDeleteModalOpenState.value = false
}

const handleManageStatusBtnCLick = () => {
  router.push({ name: 'status-manage' })
}

const handleSort = (e) => {
  boardStore.sortTasks(e.sortBy, e.sortDirection)
}
</script>

<template>
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

  <Teleport to="#navbar-item-left">
    <button @click="handleManageStatusBtnCLick" type="button"
      class="itbkk-manage-status btn btn-outline btn-sm hidden sm:flex">
      <IconSVG iconName="sliders2-vertical" :scale="1.25" />Manage Status
    </button>
  </Teleport>
  <Teleport to="#navbar-item-right">
    <div class="flex gap-2">
      <BaseMenu side="left" class="sm:hidden">
        <template #icon>
          <IconSVG iconName="three-dots" />
        </template>
        <template #menu>
          <li>
            <button @click="handleRefreshBtnCLick" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap">
              <div :class="{ 'animate-spin': boardStore.isLoading }">
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
      </BaseMenu>
      <button @click="handleRefreshBtnCLick" type="button" class="btn btn-secondary btn-sm hidden sm:flex">
        <div :class="{ 'animate-spin': boardStore.isLoading }">
          <IconSVG iconName="arrow-clockwise" :scale="1.25" />
        </div>Refresh Tasks
      </button>
      <button @click="handleAddBtnCLick" type="button" class="itbkk-button-add btn btn-primary btn-sm text-neutral">
        <IconSVG iconName="plus" :scale="1.25" />Add Task
      </button>
    </div>
  </Teleport>

  <div class="px-4 max-w-full table-overflow-x-scroll py-20">
    <table class="table border border-base-300">
      <thead class="bg-base-200">
        <tr class="select-none">
          <th class="min-w-16 max-w-16"></th>
          <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">
            <div class="flex gap-2">
              <div>Title</div>
              <SortButton @clickSortButton="handleSort" sortBy="title" :currentSortBy="boardStore.options.sortBy"
                :currentSortDirection="boardStore.options.sortDirection" />
            </div>
          </th>
          <th class="min-w-60 max-w-60 sm:min-w-[40vw] sm:max-w-[40vw]">
            <div class="flex gap-2">
              <div>Assignees</div>
              <SortButton @clickSortButton="handleSort" sortBy="assignees" :currentSortBy="boardStore.options.sortBy"
                :currentSortDirection="boardStore.options.sortDirection" />
            </div>
          </th>
          <th class="min-w-44 max-w-44">
            <div class="flex gap-2">
              <div>Status</div>
              <SortButton @clickSortButton="handleSort" sortBy="status.name" :currentSortBy="boardStore.options.sortBy"
                :currentSortDirection="boardStore.options.sortDirection" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="boardStore.isLoading && boardStore.tasks.length === 0">
          <td colspan="4" class="text-center">Loading tasks...</td>
        </tr>
        <tr v-else-if="boardStore.tasks === null">
          <td colspan="4" class="text-center">Error while loading tasks from server. Please try again later.</td>
        </tr>
        <tr v-else-if="boardStore.tasks.length === 0">
          <td colspan="4" class="text-center">No task</td>
        </tr>
        <tr v-else v-for="(task, index) in boardStore.tasks" :key="task.id" class="itbkk-item">
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
            <StatusBadge :statusData="task.status" textWrapMode="truncate" width="100%"
              :class="{ 'itbkk-status': $route.name === 'all-task' }" />
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
