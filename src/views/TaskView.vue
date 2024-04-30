<script setup>
import { useTaskStore } from '@/stores/task'
import { onMounted, ref } from 'vue'
import LoadingModal from '@/components/LoadingModal.vue'
import StatusBadge from '@/components/StatusBadge.vue';
import { useRouter } from 'vue-router';
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
  router.push({ name: 'task-id', params: { taskId } })
}

// function testToast() {
//   toastStore.createToast({
//     title: 'Welcome to IT-Bangmod Kradan Kanban',
//     description: 'This is a simple kanban board for IT-Bangmod Kradan',
//     status: 'info'
//   })
// }

</script>

<template>
  <!-- <button @click="testToast" class="itbkk-button btn btn-sm btn-success">
    Test Toast
  </button> -->
  <LoadingModal :isLoading="isLoading" />

  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <main>
    <section class="flex px-6 sm:justify-center max-w-full overflow-auto table-overflow-x-scroll">
      <table class="table w-[60rem] max-w-[90%] border border-base-300">
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
