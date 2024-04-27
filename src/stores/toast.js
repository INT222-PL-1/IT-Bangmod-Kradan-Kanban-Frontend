import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  let nextId = 0
  const toasts = ref([
    { id: 0, message: 'Welcome to Pinia!', status: 'success' },
    { id: 1, message: 'This is a warning', status: 'warning' },
    { id: 2, message: 'This is an error', status: 'error' }
  ])

  function addToast(toastMessage, toastStatus) {
    toasts.value.push({ id: nextId++, message: toastMessage, status: toastStatus })
  }

  return { toasts, addToast }
})
