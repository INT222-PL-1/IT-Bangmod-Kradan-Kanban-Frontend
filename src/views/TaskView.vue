<script setup>
import { useTaskStore } from '@/stores/task'
import { onMounted, ref } from 'vue'
import LoadingModal from '@/components/LoadingModal.vue'
import StatusBadge from '@/components/StatusBadge.vue';
import { useRouter } from 'vue-router';
import IconSVG from '@/components/IconSVG.vue';
// import { useToastStore } from '@/stores/toast';


const isLoading = ref(false)
const router = useRouter()
const taskStore = useTaskStore()
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

</script>

<template>
  <LoadingModal :isLoading="isLoading" />

  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <main>
    <nav class="flex justify-center items-center h-12 bg-base-200 border-y-2 border-base-300">
      <div class="container flex justify-end">
        <button @click="handleAddBtnCLick" type="button" class="btn btn-outline btn-sm">
          <IconSVG iconName="plus" :scale="1.25" />Add Task
        </button>
      </div>
    </nav>
    <section class="mt-12 flex flex-col sm:items-center max-w-full table-overflow-x-scroll">
      <div class="mx-6 w-[60rem] max-w-[90%]">
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
              <td>{{ index + 1 }}</td>
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
