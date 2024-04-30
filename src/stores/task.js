import { ref } from 'vue'
import { defineStore } from 'pinia'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const useTaskStore = defineStore('task', () => {
  const tasks = ref(0)

  async function fetchTasks() {
    try {
      const res = await fetch(`${SERVER_URL}/tasks`)
      tasks.value = await res.json()
    } catch (error) {
      console.error(error)
    }
  }

  return { tasks, fetchTasks }
})
