import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getBoardById, getBoards, patchBoard } from '@/libs/boardManagement'
import { getStatuses } from '@/libs/statusManagement'
import { getTasks } from '@/libs/taskManagement'
import { useRoute } from 'vue-router'
import { useToastStore } from './toast'

export const useBoardStore = defineStore('board', () => {
  const route = useRoute()
  const toastStore = useToastStore()
  const isLoading = ref({
    board: false,
    task: false,
    status: false
  })
  const boards = ref([])
  const currentBoard = ref(null)
  const tasks = ref([])
  const statuses = ref([])
  const options = ref({
    sortBy: null,
    sortDirection: null,
    filterStatuses: []
  })
  
  async function loadTasks(boardId = route.params.boardId) {
    isLoading.value.task = true
    const res = await getTasks(options.value, boardId)
    if (res.status === 'success') {
      tasks.value = res.data
    }
    isLoading.value.task = false
  }

  async function loadStatuses(boardId = route.params.boardId) {
    isLoading.value.status = true
    const res = await getStatuses(boardId)
    if (res.status === 'success') {
      statuses.value = res.data
    }
    isLoading.value.status = false
  }

  async function loadAllBoards() {
    isLoading.value.board = true
    const res = await getBoards()
    if (res.status === 'success') {
      boards.value = res.data
    }
    isLoading.value.board = false    
  }

  async function loadBoard(boardId = route.params.boardId) {
    isLoading.value.board = true
    const res = await getBoardById(boardId)
    if (res.status === 'success') {
      currentBoard.value = { ...res.data, isPublic: res.data.visibility === 'PUBLIC' }
      await loadTasks(boardId)
      await loadStatuses(boardId)
    }
    isLoading.value.board = false
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

  async function toggleBoardVisibility() {
    const res = await patchBoard(currentBoard.value.id, {
      visibility: currentBoard.value.isPublic ? 'PRIVATE' : 'PUBLIC'
    }, {
      noGlobalResponseHandler: true
    })
    if (res.status === 'success') {
      currentBoard.value.isPublic = !currentBoard.value.isPublic
    } else if (res.statusCode === 403) {
      toastStore.createToast({
        title: 'Error',
        description: 'You do not have permission to change board visibility mode.',
        status: 'error'
      })
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'Failed to update board visibility. Please try again later.',
        status: 'error'
      })
    }
  }

  function clearBoardData() {
    currentBoard.value = null
    tasks.value.splice(0, tasks.value.length)
    statuses.value.splice(0, statuses.value.length)
    options.value.sortBy = null
    options.value.sortDirection = null
    clearTaskFilterStatus()
  }

  // watch(() => options.value.boardId, fetchBoard, { immediate: true })

  watch(options, async () => {
    await loadTasks()
  }, { deep: true })

  return {
    isLoading,
    boards,
    tasks,
    statuses,
    currentBoard,
    options,
    loadTasks,
    loadStatuses,
    loadAllBoards,
    loadBoard,
    sortTasks,
    addTaskFilterStatus,
    removeTaskFilterStatus,
    clearTaskFilterStatus,
    toggleBoardVisibility,
    clearBoardData
  }
})
