import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  let nextId = 0
  const toasts = ref([
    // { id: 0, message: 'Welcome to Pinia!', status: 'success', endTime: Date.now() + 5000 },
    // { id: 1, message: 'This is a warning', status: 'warning', endTime: Date.now() + 10000 },
    // { id: 2, message: 'This is an error', status: 'error', endTime: Date.now() + 15000 }
  ])

  function createToast(toastObject) {
    const id = nextId++

    toasts.value.push({
      id,
      ...toastObject
    })

    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    toasts.value.splice(index, 1)
  }

  return { toasts, createToast, removeToast }
})
