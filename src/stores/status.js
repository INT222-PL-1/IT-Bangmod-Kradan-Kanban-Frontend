import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getStatuses } from '@/libs/statusManagement'

export const useStatusStore = defineStore('status', () => {
  const statuses = ref([])

  async function loadStatuses() {
    const responseObj = await getStatuses()
    if (responseObj.status === 'success') {
      statuses.value = responseObj.data
    }
  }

  return { statuses, loadStatuses }
})
