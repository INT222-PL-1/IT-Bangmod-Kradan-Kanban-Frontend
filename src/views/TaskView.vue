<script setup>
import { onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useRoute, useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import BaseMenu from '@/components/BaseMenu.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import { deleteTask } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
import SortButton from '@/components/SortButton.vue'
import { useBoardStore } from '@/stores/board'
import BoardSettingsModal from '@/components/BoardSettingsModal.vue'
import StatusFilterBar from '@/components/StatusFilterBar.vue'
import BoardVisibilityToggleButton from '@/components/BoardVisibilityToggleButton.vue'
import BaseTooltip from '@/components/BaseTooltip.vue'
import { useUserStore } from '@/stores/user'
import TaskCard from '@/components/TaskCard.vue'
import BaseTablePlate from '@/components/BaseTablePlate.vue'
import MiniModal from '@/components/MiniModal.vue'
import { HttpStatusCode } from 'zyos'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

const toastStore = useToastStore()
const boardStore = useBoardStore()
const userStore = useUserStore()

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
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  router.push({ name: 'task-add' })
}

const handleOpenDeleteModal = (taskData) => {
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  taskDeleteModalData.value = taskData
  taskDeleteModalOpenState.value = true
}

const handleDeleteTask = async (taskId) => {
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  const res = await deleteTask(taskId, route.params.boardId)
  if (res.ok) {
    toastStore.createToast({
      title: 'Success',
      description: 'The task has been deleted.',
      status: 'success'
    })
    await refreshBoardTasks()
  } else {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later' : res.message}.`,
      status: 'error'
    })
    await refreshBoardTasks()
  }
  taskDeleteModalOpenState.value = false
}

const handleEditBtnClick = (taskId) => {
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  router.push({ name: 'task-edit', params: { taskId } })
}

const handleSort = (e) => {
  boardStore.sortTasks(e.sortBy, e.sortDirection)
}

const handleSettingsButtonClick = () => {
  if (userStore.isOwnerOfCurrentBoard === false) return
  boardSettingsModalOpenState.value = true
}

const handleToggleVisibilityButtonClick = () => {
  if (userStore.isOwnerOfCurrentBoard === false) return
  boardVisibilityModalOpenState.value = true
}

const handleToggleBoardVisibility = async () => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(() => {
      boardVisibilityModalOpenState.value = false
      resolve()
    }, 300))
    await boardStore.toggleBoardVisibility()
    await refreshBoardTasks()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>

  <BoardSettingsModal :show="boardSettingsModalOpenState" @clickClose="boardSettingsModalOpenState = false" />

  <MiniModal Modal :isLoading="isLoading" @clickBG="boardVisibilityModalOpenState = false" :show="boardVisibilityModalOpenState" :mobileCenter="true">
    <template #title>Do you want to change board visibility to {{ boardStore.currentBoard?.isPublic ? 'private' : 'public' }}?</template>
    <template #content>
      <div class="text-error">
        This board is currently in <span class="font-semibold">{{ boardStore.currentBoard?.isPublic ? 'Public' : 'Private' }}</span> mode.
      </div>
      <div>
        {{
          boardStore.currentBoard?.isPublic
            ? 'In private, only board owner can access/control board. Do you want to change the visibility to Private?'
            : 'In public, any one can view the board, task list and task detail of tasks in the board. Do you want to change the visibility to Public?'
        }}
      </div>
    </template>
    <template #actions>
      <button @click="boardVisibilityModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Cancel
      </button>
      <button @click="handleToggleBoardVisibility" :disabled="isLoading"
        class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
        Confirm
      </button>
    </template>
  </MiniModal>

  <MiniModal @clickBG="taskDeleteModalOpenState = false" :show="taskDeleteModalOpenState" :mobileCenter="true">
    <template #title>Delete Task</template>
    <template #content>
      <div class="itbkk-message break-words">
        Do you want to delete the task number {{ taskDeleteModalData.id }} -
        "<span class="opacity-75 italic">{{ taskDeleteModalData.title }}</span>"?
      </div>
    </template>
    <template #actions>
      <button @click="taskDeleteModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Cancel
      </button>
      <button @click="handleDeleteTask(taskDeleteModalData.id)"
        class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
        Confirm
      </button>
    </template>
  </MiniModal>

  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <section class="max-w-full pt-10 pb-20">

    <!-- ? Mobile View -->
    <div class="block sm:hidden">
      <div class="px-4 mb-4 flex justify-between">
        <StatusFilterBar compact />
        <div class="flex gap-2">
          <BaseMenu side="left">
            <template #icon>
              <IconSVG iconName="three-dots" scale="1.25" />
            </template>
            <template #menu>
              <button v-if="userStore.hasWriteAccessOnCurrentBoard" @click="handleAddBtnClick" type="button"
                class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                <IconSVG iconName="plus" :scale="1.25" />Add Task
              </button>
              <button @click="handleRefreshBtnClick" type="button" class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                <div :class="{ 'animate-spin': boardStore.isLoading.task }">
                  <IconSVG iconName="arrow-clockwise" :scale="1.25" />
                </div>Refresh Tasks
              </button>
              <button v-if="userStore.isOwnerOfCurrentBoard" @click="handleSettingsButtonClick" type="button" class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                <IconSVG iconName="gear" :scale="1.25" />Board Settings
              </button>
            </template>
          </BaseMenu>
          <BoardVisibilityToggleButton @click="handleToggleVisibilityButtonClick" :disabled="userStore.isOwnerOfCurrentBoard === false" />
        </div>
      </div>
      <div v-if="boardStore.isLoading.task && boardStore.tasks.length === 0">
        <div colspan="4" class="flex justify-center items-center h-32">Loading tasks...</div>
      </div>
      <div v-else-if="boardStore.tasks === null">
        <div colspan="4" class="flex justify-center items-center h-32">Error while loading tasks from server. Please try again later.</div>
      </div>
      <div v-else-if="boardStore.tasks.length === 0">
        <div colspan="4" class="flex justify-center items-center h-32">No task</div>
      </div>
      <div v-else>
        <div
          v-for="(task, index) in boardStore.tasks"
          :key="task.id"
        >
          <TaskCard
            @titleClick="handleTaskClick(task.id)"
            @editClick="handleEditBtnClick(task.id)"
            @deleteClick="handleOpenDeleteModal(task)"
            :task="task"
            :index="index"
            :hasWritePermission="userStore.hasWriteAccessOnCurrentBoard"
          />
          <div class="divider"></div>
        </div>
      </div>
    </div>
    
    <!-- ? Desktop View -->
    <BaseTablePlate>
      <template #left-menu>
        <StatusFilterBar />
      </template>
      <template #right-menu>
        <BaseMenu side="left" class="md:hidden">
          <template #icon>
            <IconSVG iconName="three-dots" scale="1.25" />
          </template>
          <template #menu>
            <button v-if="userStore.hasWriteAccessOnCurrentBoard" @click="handleAddBtnClick" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
              <IconSVG iconName="plus" :scale="1.25" />Add Task
            </button>
            <button @click="handleRefreshBtnClick" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
              <div :class="{ 'animate-spin': boardStore.isLoading.task }">
                <IconSVG iconName="arrow-clockwise" :scale="1.25" />
              </div>Refresh Tasks
            </button>
            <button v-if="userStore.isOwnerOfCurrentBoard" @click="handleSettingsButtonClick" type="button" class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
              <IconSVG iconName="gear" :scale="1.25" />Board Settings
            </button>
          </template>
        </BaseMenu>
        <BaseTooltip text="You need to be board owner to perform this action." :disabled="userStore.isOwnerOfCurrentBoard">
          <BoardVisibilityToggleButton @click="handleToggleVisibilityButtonClick" 
          className="itbkk-board-visibility" :disabled="userStore.isOwnerOfCurrentBoard === false" />
        </BaseTooltip>
        <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
          <button @click="handleAddBtnClick" type="button"
            class="itbkk-button-add btn btn-primary btn-sm text-neutral hidden md:flex" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
            <IconSVG iconName="plus" :scale="1.25" />Add Task
          </button>
        </BaseTooltip>
        <BaseTooltip text="Refresh Tasks">
          <button @click="handleRefreshBtnClick" type="button" class="btn btn-secondary btn-sm btn-square hidden md:flex">
            <div :class="{ 'animate-spin': boardStore.isLoading.task }">
              <IconSVG iconName="arrow-clockwise" :scale="1.25" />
            </div>
          </button>
        </BaseTooltip>
        <BaseTooltip :text="userStore.isOwnerOfCurrentBoard ? 'Board Setting' : 'You need to be board owner to perform this action.'">
          <button @click="handleSettingsButtonClick" type="button" class="itbkk-status-setting btn btn-secondary btn-sm btn-square hidden md:flex" :disabled="userStore.isOwnerOfCurrentBoard === false">
            <IconSVG iconName="gear" :scale="1.25" />
          </button>
        </BaseTooltip>
      </template>
      <template #table>
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
                      <div>
                        <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard" className="w-full">
                          <ButtonWithIcon @click="handleEditBtnClick(task.id)"
                            className="itbkk-button-edit btn btn-sm btn-ghost justify-start flex flex-nowrap w-full"
                            iconName="pencil-square" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
                            Edit
                          </ButtonWithIcon>
                        </BaseTooltip>
                      </div>
                      <div>
                        <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard" className="w-full">
                          <ButtonWithIcon @click="handleOpenDeleteModal(task)"
                            className="itbkk-button-delete btn btn-sm btn-ghost justify-start text-error flex flex-nowrap w-full"
                            iconName="trash-fill" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
                            Delete
                          </ButtonWithIcon>
                        </BaseTooltip>
                      </div>
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
      </template>
    </BaseTablePlate>
  </section>
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
