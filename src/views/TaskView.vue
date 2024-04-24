<script setup>
import { useTaskStore } from '@/stores/task'
import { onMounted, ref } from 'vue'
import { getTimezone, formatDateTime } from '@/libs/utils'
import BaseModal from '@/components/BaseModal.vue'
import StatusBadge from '@/components/StatusBadge.vue';

const taskStore = useTaskStore()
const taskOpenState = ref(false)
const taskModalData = ref({})

onMounted(async () => {
  await taskStore.fetchTasks()
})

async function fetchTaskById(id) {
  return await taskStore.fetchTaskById(id)
}

const handleOpenTaskModal = async (taskId) => {
  taskModalData.value = await fetchTaskById(taskId)
  taskOpenState.value = true
}

const handleCloseTaskModal = () => {
  taskOpenState.value = false
}
</script>

<template>
  <BaseModal :show="taskOpenState">
    <div class="bg-base-100 w-[50rem] max-w-[90%] rounded-xl">
      <div class="itbkk-title text-2xl font-bold p-4 bg-base-200 text-ellipsis overflow-hidden">{{ taskModalData.title
        }}</div>
      <div class="grid grid-rows-1 grid-cols-2">
        <div>
          <div class="p-4 w-full h-full flex flex-col">
            <div class="text-lg font-semibold flex-[0]">Description</div>
            <div :class="{
              'italic text-[grey] grid place-items-center': !taskModalData.description,
            }" class="bg-neutral px-4 py-2 mt-2 rounded-lg overflow-auto flex-[1]">
              <div class="itbkk-description">{{ taskModalData.description || 'No description provided' }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="p-4">
            <div class="text-lg font-semibold">Assignees</div>
            <div :class="{
              'italic text-[grey]': !taskModalData.assignees,
            }" class="itbkk-assignees">
              {{ taskModalData.assignees || 'Unassigned' }}
            </div>
          </div>
          <div class="p-4">
            <div class="text-lg font-semibold">Status</div>
            <StatusBadge :status="taskModalData.status" class="itbkk-status" />
          </div>
          <div>
            <div class="p-4 flex flex-col gap-1">
              <!-- <div class="text-lg font-bold">Timezone</div> -->
              <div class="flex">
                <div class="flex-[2] font-semibold">Timezone</div>
                <div class="itbkk-timezone flex-[3] text-sm bg-neutral rounded-lg px-2">
                  {{ getTimezone() }}
                </div>
              </div>
              <div class="flex">
                <div class="flex-[2] font-semibold">Created On</div>
                <div class="itbkk-timezone flex-[3] text-sm bg-neutral rounded-lg px-2">
                  {{ formatDateTime(taskModalData.createdOn) }}
                </div>
              </div>
              <div class="flex">
                <div class="flex-[2] font-semibold">Updated On</div>
                <div class="itbkk-timezone flex-[3] text-sm bg-neutral rounded-lg px-2">
                  {{ formatDateTime(taskModalData.updatedOn) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-2 p-4">
        <button @click="handleCloseTaskModal" class="itbkk-button btn btn-sm btn-success">
          Ok
        </button>
        <button @click="handleCloseTaskModal" class="itbkk-button btn btn-sm btn-neutral">
          Close
        </button>
      </div>
    </div>
  </BaseModal>
  <main>
    <!-- {{ taskStore.tasks }} -->
    <section class="flex justify-center">
      <table class="table w-[60rem] max-w-[90%] border border-base-300">
        <thead class="bg-base-200">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Assignees</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in taskStore.tasks" :key="task.id" class="itbkk-item">
            <td>{{ task.id }}</td>
            <td @click="handleOpenTaskModal(task.id)" class="hover:underline hover:cursor-pointer">
              <div class="itbkk-title overflow-hidden w-full max-w-72 text-ellipsis">{{ task.title }}</div>
            </td>
            <td class="itbkk-assignees">{{ task.assignees }}</td>
            <td>
              <div class="grid place-items-center">
                <StatusBadge :status="task.status" class="itbkk-status" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>
