import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTasks } from '@/libs/taskManagement'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref(0)

  async function fetchTasks() {
    tasks.value = await getTasks()
  }

  return { tasks, fetchTasks }
})
