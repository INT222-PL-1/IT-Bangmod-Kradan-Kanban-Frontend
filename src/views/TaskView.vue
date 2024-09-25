<script setup>
import { onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useRoute, useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import BaseMenu from '@/components/BaseMenu.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import BaseModal from '@/components/BaseModal.vue'
import { deleteTask } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
import SortButton from '@/components/SortButton.vue'
import { useBoardStore } from '@/stores/board'
import BoardSettingsModal from '@/components/BoardSettingsModal.vue'
import StatusFilterBar from '@/components/StatusFilterBar.vue'
import BoardVisibilityToggleButton from '@/components/BoardVisibilityToggleButton.vue'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const boardStore = useBoardStore()

const taskDeleteModalData = ref(null)
const taskDeleteModalOpenState = ref(false)
const boardSettingsModalOpenState = ref(false)

const boardVisibilityModalOpenState = ref(false)

async function refreshBoardTasks() {
  await boardStore.loadBoard()
}

onMounted(async () => {
  await refreshBoardTasks()
})

const handleRefreshBtnClick = async () => {
  await refreshBoardTasks()
}

const handleTaskClick = (taskId) => {
  router.push({ name: 'task-view', params: { taskId } })
}

const handleAddBtnClick = () => {
  router.push({ name: 'task-add' })
}

const handleOpenDeleteModal = (taskData) => {
  taskDeleteModalData.value = taskData
  taskDeleteModalOpenState.value = true
}

const handleDeleteTask = async (taskId) => {
  const responseObj = await deleteTask(taskId, route.params.boardId)
  if (responseObj.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${responseObj.message}.`,
      status: 'error'
    })
    await refreshBoardTasks()
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The task has been deleted.',
      status: 'success'
    })
    await refreshBoardTasks()
  }
  taskDeleteModalOpenState.value = false
}

const handleEditBtnClick = (taskId) => {
  router.push({ name: 'task-edit', params: { taskId } })
}

const handleSort = (e) => {
  boardStore.sortTasks(e.sortBy, e.sortDirection)
}

const handleSettingsButtonClick = () => {
  boardSettingsModalOpenState.value = true
}

defineExpose({
  test: 'test'
})
</script>

<template>

  <BoardSettingsModal :show="boardSettingsModalOpenState" @clickClose="boardSettingsModalOpenState = false" />

  <Transition>
    <BaseModal @clickBG="taskDeleteModalOpenState = false" :show="taskDeleteModalOpenState" :mobileCenter="true">
      <div class="bg-base-300 w-[30rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-100 break-words flex-none">Delete Task</div>
        <div class="itbkk-message p-4 break-words">
          Do you want to delete the task number {{ taskDeleteModalData.id }} -
          "<span class="opacity-75 italic">{{ taskDeleteModalData.title }}</span>"?
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
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

  <div class="max-w-full pt-10 pb-20">
    <div class="bg-base-300 rounded-lg shadow-md">
      <div class="px-4 min-h-8 sticky top-[8rem] z-10 py-3 border-b-base-200 border-b-2 bg-base-300 rounded-t-lg">
        <div class="flex justify-between py-2">
          <StatusFilterBar />
          <div class="flex gap-2">
            <BaseMenu side="left" class="md:hidden">
              <template #icon>
                <IconSVG iconName="three-dots" scale="1.25" />
              </template>
              <template #menu>
                <button @click="handleRefreshBtnClick" type="button"
                  class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                  <div :class="{ 'animate-spin': boardStore.isLoading.task }">
                    <IconSVG iconName="arrow-clockwise" :scale="1.25" />
                  </div>Refresh Tasks
                </button>
                <button @click="handleAddBtnClick" type="button"
                  class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                  <IconSVG iconName="plus" :scale="1.25" />Add Task
                </button>
                <button @click="handleSettingsButtonClick" type="button" class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                  <IconSVG iconName="gear" :scale="1.25" />Board Settings
                </button>
              </template>
            </BaseMenu>
            <BoardVisibilityToggleButton />
            <button @click="handleSettingsButtonClick" type="button" class="itbkk-status-setting btn btn-ghost btn-sm hidden md:flex">
              <IconSVG iconName="gear" :scale="1.25" />Board Settings
            </button>
            <button @click="handleRefreshBtnClick" type="button" class="btn btn-secondary btn-sm hidden md:flex">
              <div :class="{ 'animate-spin': boardStore.isLoading.task }">
                <IconSVG iconName="arrow-clockwise" :scale="1.25" />
              </div>Refresh Tasks
            </button>
            <button @click="handleAddBtnClick" type="button"
              class="itbkk-button-add btn btn-primary btn-sm text-neutral hidden md:flex">
              <IconSVG iconName="plus" :scale="1.25" />Add Task
            </button>
          </div>
        </div>
      </div>
      <div class="table-overflow-x-scroll p-4">
        <table class="table table-zebra">
          <thead>
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
                  <SortButton class="itbkk-status-sort" @clickSortButton="handleSort" sortBy="status.name"
                    :currentSortBy="boardStore.options.sortBy" :currentSortDirection="boardStore.options.sortDirection" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="boardStore.isLoading.task && boardStore.tasks.length === 0">
              <td colspan="4" class="text-center h-32">Loading tasks...</td>
            </tr>
            <tr v-else-if="boardStore.tasks === null">
              <td colspan="4" class="text-center h-32">Error while loading tasks from server. Please try again later.</td>
            </tr>
            <tr v-else-if="boardStore.tasks.length === 0">
              <td colspan="4" class="text-center h-32">No task</td>
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
                        <ButtonWithIcon @click="handleEditBtnClick(task.id)"
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
                class="overflow-hidden min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw] hover:underline hover:cursor-pointer">
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
        <div class="h-16"></div>
      </div>
    </div>
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
