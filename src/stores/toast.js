import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  let nextId = 0
  const toasts = ref([
    // { id: 0, message: 'Welcome to Pinia!', status: 'success', endTime: Date.now() + 5000 },
    // { id: 1, message: 'This is a warning', status: 'warning', endTime: Date.now() + 10000 },
    // { id: 2, message: 'This is an error', status: 'error', endTime: Date.now() + 15000 }
  ])

  /**
   * Create a new toast
   * @param {Object} toastData
   * @param {String} toastData.title
   * @param {String} toastData.description
   * @param {'success' | 'error' | 'warning' | 'info'} toastData.status
   * @param {Number} toastData.duration
   * @param {Number} toastData.delay
   */
  function createToast(toastData) {
    const id = nextId++

    if (!toastData.duration) toastData.duration = 5000
    if (!toastData.delay) toastData.delay = 0

    const { duration, delay } = toastData

    setTimeout(() => {
      toasts.value.push({
        id,
        ...toastData,
      })
    }, delay)

    setTimeout(() => {
      removeToast(id)
    }, duration + delay)
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index === -1) return
    toasts.value.splice(index, 1)
  }

  return { toasts, createToast, removeToast }
})
