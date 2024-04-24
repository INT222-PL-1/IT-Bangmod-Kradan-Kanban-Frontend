import { ref } from 'vue'
import { defineStore } from 'pinia'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const useTaskStore = defineStore('task', () => {
  const tasks = ref(0)

  async function fetchTasks() {
    const res = await fetch(`${SERVER_URL}/tasks`)
    tasks.value = await res.json()
  }

  async function fetchTaskById(id) {
    const res = await fetch(`${SERVER_URL}/tasks/${id}`)
    return await res.json()
  }

  return { tasks, fetchTasks, fetchTaskById }
})
