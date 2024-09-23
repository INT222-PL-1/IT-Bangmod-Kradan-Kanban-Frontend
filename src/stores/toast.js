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
   * @param {String | 'success' | 'error' | 'warning' | 'info'} toastData.status
   * @param {Number} toastData.duration
   * @param {Number} toastData.delay
   */
  function createToast(toastData) {
    const id = nextId++

    const createToastTimeout = setTimeout(() => {
      toasts.value.push({
        id,
        ...toastData,
      })
      clearTimeout(createToastTimeout)
    }, toastData.delay || 0)

    const removeToastTimeout = setTimeout(() => {
      removeToast(id)
      clearTimeout(removeToastTimeout)
    }, toastData.duration || 5000)
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index === -1) return
    toasts.value.splice(index, 1)
  }

  return { toasts, createToast, removeToast }
})
