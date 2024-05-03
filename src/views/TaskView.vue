<script setup>
import { useTaskStore } from '@/stores/task'
import { onMounted, ref } from 'vue'
import LoadingModal from '@/components/LoadingModal.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import BaseMenu from '@/components/BaseMenu.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import BaseModal from '@/components/BaseModal.vue'
import { deleteTask } from '@/libs/taskManagement'
import { useToastStore } from '@/stores/toast'
// import { useToastStore } from '@/stores/toast';


const isLoading = ref(false)
const router = useRouter()
const toastStore = useToastStore()
const taskStore = useTaskStore()
const taskDeleteModalData = ref(null)
const taskDeleteModalOpenState = ref(false)
// const toastStore = useToastStore()

onMounted(async () => {
  isLoading.value = true
  await taskStore.fetchTasks()
  isLoading.value = false
})

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
      description: `Task "${taskDeleteModalData.value.title}" not found`,
      status: 'error'
    })
  } else if (deletedTask === null) {
    toastStore.createToast({
      title: 'Error',
      description: `Task "${taskDeleteModalData.value.title}" could not be deleted`,
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: `Task "${deletedTask.title}" deleted`,
      status: 'success'
    })
    await taskStore.fetchTasks()
  }
  taskDeleteModalOpenState.value = false
}

</script>

<template>
  <LoadingModal :isLoading="isLoading" />

  <Transition>
    <BaseModal @clickBG="taskDeleteModalOpenState = false" :show="taskDeleteModalOpenState" :mobileCenter="true">
      <div class="bg-base-100 w-[30rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Delete Task</div>
        <div class="p-4 break-words">Do you want to delete the task "{{ taskDeleteModalData.title }}"?</div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="taskDeleteModalOpenState = false" class="itbkk-button btn btn-sm btn-neutral">
              Cancel
            </button>
            <button @click="handleDeleteTask(taskDeleteModalData.id)"
              class="itbkk-button btn btn-sm btn-error btn-outline">
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

  <main>
    <Teleport to="#header-right">
      <button @click="handleAddBtnCLick" type="button" class="btn btn-primary btn-sm text-neutral">
        <IconSVG iconName="plus" :scale="1.25" />Add Task
      </button>
    </Teleport>
    <section class="mt-12 flex flex-col sm:items-center max-w-full table-overflow-x-scroll">
      <div class="mx-6 w-[60rem] max-w-[90%]">
        <div class="text-center p-2 text-xl font-semibold">Task Table</div>
        <table class="table border border-base-300">
          <thead class="bg-base-200">
            <tr>
              <th></th>
              <th>Title</th>
              <th>Assignees</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, index) in taskStore.tasks" :key="task.id" class="itbkk-item">
              <td>
                <div class="flex items-center justify-between gap-2">
                  <div>{{ index + 1 }}</div>
                  <BaseMenu>
                    <template #icon>
                      <IconSVG iconName="three-dots-vertical" />
                    </template>
                    <template #menu>
                      <div class="bg-base-200 rounded-lg p-2 flex flex-col border border-base-300 drop-shadow-lg">
                        <ButtonWithIcon @click="handleEditBtnCLick(task.id)" className="btn btn-sm justify-start"
                          iconName="pencil-square" text="Edit" />
                        <ButtonWithIcon @click="handleOpenDeleteModal(task)"
                          className="btn btn-sm justify-start text-error" iconName="trash-fill" text="Delete" />
                      </div>
                    </template>
                  </BaseMenu>
                </div>
              </td>
              <td @click="handleTaskClick(task.id)" class="hover:underline hover:cursor-pointer">
                <div class="itbkk-title overflow-hidden max-w-52 md:max-w-72 lg:max-w-96 text-ellipsis font-semibold">
                  {{ task.title }}
                </div>
              </td>
              <td :class="{ 'italic text-[grey]': !task.assignees }" class="itbkk-assignees">{{ task.assignees ||
                'Unassigned' }}</td>
              <td>
                <div class="grid place-items-center">
                  <StatusBadge :status="task.status" class="itbkk-status" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="h-16"></div>
      </div>
    </section>
  </main>
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
