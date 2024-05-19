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

  async function fetchBoard() {
    isLoading.value = true
    board.value = await getBoardById(options.value.boardId)
    console.log(board.value)
    isLoading.value = false
  }

  async function fetchTasks() {
    isLoading.value = true
    tasks.value = await getTasks(options.value)
    isLoading.value = false
  }

  function sortTasks(sortBy, sortDirection) {
    options.value.sortBy = sortBy
    options.value.sortDirection = sortDirection
  }

  function addTaskFilterStatus(status) {
    if (options.value.filterStatuses.includes(status)) return
    options.value.filterStatuses.push(status)
  }

  function removeTaskFilterStatus(status) {
    options.value.filterStatuses.splice(options.value.filterStatuses.indexOf(status), 1)
  }

  function clearTaskFilterStatus() {
    options.value.filterStatuses.splice(0, options.value.filterStatuses.length)
    console.log('hello');
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
