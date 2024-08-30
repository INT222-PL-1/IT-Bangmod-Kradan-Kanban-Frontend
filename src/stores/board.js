import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getBoardById } from '@/libs/boardManagement'
import { getTasks } from '@/libs/taskManagement'

export const useBoardStore = defineStore('board', () => {
  const isLoading = ref(false)
  const board = ref(null)
  const tasks = ref([])
  const options = ref({
    boardId: 1,
    sortBy: null,
    sortDirection: null,
    filterStatuses: []
  })
  
  async function fetchTasks() {
    isLoading.value = true
    const responseObj = await getTasks(options.value)
    if (responseObj.status === 'success') {
      tasks.value = responseObj.data
    }
    isLoading.value = false
  }
  
  async function fetchBoard() {
    isLoading.value = true
    const responseObj = await getBoardById(options.value.boardId)
    if (responseObj.status === 'success') {
      board.value = responseObj.data
    }
    await fetchTasks()
    isLoading.value = false
  }

  function sortTasks(sortBy, sortDirection) {
    options.value.sortBy = sortBy
    options.value.sortDirection = sortDirection
  }

  function addTaskFilterStatus(statusName) {
    if (options.value.filterStatuses.includes(statusName)) return
    options.value.filterStatuses.push(statusName)
  }

  function removeTaskFilterStatus(statusName) {
    options.value.filterStatuses.splice(options.value.filterStatuses.indexOf(statusName), 1)
  }

  function clearTaskFilterStatus() {
    options.value.filterStatuses.splice(0, options.value.filterStatuses.length)
  }

  watch(() => options.value.boardId, fetchBoard, { immediate: true })

  watch(options, fetchTasks, { deep: true, immediate: true })

  return {
    isLoading,
    board,
    tasks,
    options,
    fetchBoard,
    fetchTasks,
    sortTasks,
    addTaskFilterStatus,
    removeTaskFilterStatus,
    clearTaskFilterStatus
  }
})
