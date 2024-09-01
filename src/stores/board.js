import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getBoardById, getBoards, getTasks } from '@/libs/boardManagement'

export const useBoardStore = defineStore('board', () => {
  const isLoading = ref(false)
  const boards = ref([])
  const selectedBoard = ref(null)
  const tasks = ref([])
  const options = ref({
    sortBy: null,
    sortDirection: null,
    filterStatuses: []
  })
  
  // async function fetchTasks() {
  //   isLoading.value = true
  //   const responseObj = await getTasks(options.value)
  //   if (responseObj.status === 'success') {
  //     tasks.value = responseObj.data
  //   }
  //   isLoading.value = false
  // }
  
  async function loadTasks(boardId) {
    isLoading.value = true
    const res = await getTasks(boardId, options.value)
    if (res.status === 'success') {
      tasks.value = res.data
    }
    isLoading.value = false
  }

  async function loadAllBoards() {
    isLoading.value = true
    const res = await getBoards()
    if (res.status === 'success') {
      boards.value = res.data
    }
    isLoading.value = false
  }

  async function loadBoard(boardId) {
    isLoading.value = true
    const res = await getBoardById(boardId)
    if (res.status === 'success') {
      selectedBoard.value = res.data
      await loadTasks()
    }
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

  // watch(() => options.value.boardId, fetchBoard, { immediate: true })

  // watch(options, fetchTasks, { deep: true, immediate: true })

  return {
    isLoading,
    boards,
    tasks,
    options,
    loadAllBoards,
    loadBoard,
    sortTasks,
    addTaskFilterStatus,
    removeTaskFilterStatus,
    clearTaskFilterStatus
  }
})
