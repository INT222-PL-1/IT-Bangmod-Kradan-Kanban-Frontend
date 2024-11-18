import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getBoardById, getBoards, patchBoard } from '@/libs/boardManagement'
import { getStatuses } from '@/libs/statusManagement'
import { getTasks } from '@/libs/taskManagement'
import { useRoute } from 'vue-router'
import { useToastStore } from './toast'
import { getCollaborators } from '@/libs/collaboratorManagement'
import Pl1VisibilityType from '@/libs/enum/Pl1VisibilityType'
import { HttpStatusCode } from 'zyos'

export const useBoardStore = defineStore('board', () => {
  const route = useRoute()
  const toastStore = useToastStore()
  const isLoading = {
    action: false,
    board: false,
    task: false,
    status: false,
    collaborator: false
  }

  const isError = {
    action: false,
    board: false,
    task: false,
    status: false,
    collaborator: false
  }

  const boards = ref([])
  const collaborativeBoards = ref([])
  
  const currentBoard = ref(null)
  const tasks = ref([])
  const statuses = ref([])
  const collaborators = ref([])

  const options = ref({
    sortBy: null,
    sortDirection: null,
    filterStatuses: []
  })

  async function loadData(loaderFunction, dataKey, ...args) {
    isLoading[dataKey] = true
    isError[dataKey] = false

    const res = await loaderFunction(...args)

    isLoading[dataKey] = false
    if (res.ok) {
      return res.data
    } else {
      isError[dataKey] = true
      return null
    }
  }
  
  
  async function loadTasks(boardId = route.params.boardId) {
    tasks.value = await loadData(getTasks, 'task', boardId, options.value)
  }

  async function loadStatuses(boardId = route.params.boardId) {
    statuses.value = await loadData(getStatuses, 'status', boardId)
  }

  async function loadCollaborators(boardId = route.params.boardId) {
    collaborators.value = await loadData(getCollaborators, 'collaborator', boardId)
  }

  async function loadAllBoards() {
    const allBoards = await loadData(getBoards, 'board')
    if (allBoards) {
      boards.value = allBoards.personalBoards
      collaborativeBoards.value = allBoards.collaborativeBoards
    } else {
      boards.value = null
      collaborativeBoards.value = null
    }
  }

  async function loadCurrentBoard(boardId = route.params.boardId) {
    const board = await loadData(getBoardById, 'board', boardId)
    if (board) {
      currentBoard.value = { ...board, isPublic: board.visibility === Pl1VisibilityType.PUBLIC }
      await Promise.all([loadTasks(boardId), loadStatuses(boardId), loadCollaborators(boardId)])
    } else {
      clearCurrentBoardData()
    }
  }

  async function updateBoard(boardId, boardData) {
    isLoading.board = true
    isError.board = false
    const res = await patchBoard(boardId, boardData)
    if (res.ok) {
      currentBoard.value = { ...currentBoard.value, ...res.data }
    } else {
      throw new Error(res.message)
    }
    isLoading.value.board = false
    isError.value.board = !res.ok
    return res.data
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
    isLoading.action = true
    const res = await patchBoard(currentBoard.value.id, {
      visibility: currentBoard.value.isPublic ? Pl1VisibilityType.PRIVATE : Pl1VisibilityType.PUBLIC
    }, {
      noGlobalResponseHandling: true
    })
    if (res.ok) {
      currentBoard.value.isPublic = !currentBoard.value.isPublic
    } else {
      toastStore.createToast({
        title: 'Error',
        description: res.statusCode === HttpStatusCode.FORBIDDEN ? 'You do not have permission to change board visibility mode.' : 'Failed to update board visibility. Please try again later.',
        status: 'error'
      })
    }
    isLoading.action = false
  }

  function clearCurrentBoardData() {
    currentBoard.value = null
    tasks.value = []
    statuses.value = []
    collaborators.value = []
    options.value.sortBy = null
    options.value.sortDirection = null
    clearTaskFilterStatus()
  }

  watch(options, async () => {
    await loadTasks()
  }, { deep: true })

  return {
    isLoading,
    isError,
    boards,
    tasks,
    statuses,
    currentBoard,
    options,
    loadTasks,
    loadStatuses,
    loadAllBoards,
    loadCurrentBoard,
    sortTasks,
    addTaskFilterStatus,
    removeTaskFilterStatus,
    clearTaskFilterStatus,
    toggleBoardVisibility,
    clearCurrentBoardData,
    updateBoard,
    collaborativeBoards,
    loadCollaborators,
    collaborators
  }
})
