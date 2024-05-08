import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getStatuses } from '@/libs/statusManagement'

export const useStatusStore = defineStore('status', () => {
  const statuses = ref([])

  async function loadStatuses() {
    statuses.value = await getStatuses()
  }

  return { statuses, loadStatuses }
})
