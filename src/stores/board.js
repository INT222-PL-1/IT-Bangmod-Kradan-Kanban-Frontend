import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getBoardById, getBoards } from '@/libs/boardManagement'
import { getStatuses } from '@/libs/statusManagement'
import { getTasks } from '@/libs/taskManagement'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from './toast'

export const useBoardStore = defineStore('board', () => {
  const route = useRoute()
  const router = useRouter()
  const toastStore = useToastStore
  ()
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
      currentBoard.value = res.data
      await loadTasks(boardId)
      await loadStatuses(boardId)
    } else if (res.status === 'error' && res.statusCode === 404) {
      await loadStatuses(boardId)
      router.push({ name: 'not-found' })
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'Failed to load board. Please try again later.',
        status: 'error'
      })
      router.push({ name: 'all-board' })
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
    clearTaskFilterStatus
  }
})
