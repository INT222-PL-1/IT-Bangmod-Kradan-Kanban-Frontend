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
  const isLoading = ref({
    microAction: false,
    board: false,
    task: false,
    status: false,
    collaborator: false
  })

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
  
  async function loadTasks(boardId = route.params.boardId) {
    isLoading.value.task = true
    const res = await getTasks(boardId, options.value)
    if (res.ok) {
      tasks.value = res.data
    }
    isLoading.value.task = false
  }

  async function loadStatuses(boardId = route.params.boardId) {
    isLoading.value.status = true
    const res = await getStatuses(boardId)
    if (res.ok) {
      statuses.value = res.data
    }
    isLoading.value.status = false
  }

  async function loadCollaborators(boardId = route.params.boardId) {
    isLoading.value.collaborator = true
    const res = await getCollaborators(boardId)
    if (res.ok) {
      collaborators.value = res.data
    }
    isLoading.value.collaborator = false
  }

  async function loadAllBoards() {
    isLoading.value.board = true
    const res = await getBoards()
    if (res.ok) {
      boards.value = res.data.personalBoards
      collaborativeBoards.value = res.data.collaborativeBoards
    }
    isLoading.value.board = false    
  }

  async function loadBoard(boardId = route.params.boardId) {
    isLoading.value.board = true
    const res = await getBoardById(boardId)
    if (res.ok) {
      currentBoard.value = { ...res.data, isPublic: res.data.visibility === Pl1VisibilityType.PUBLIC }
      await Promise.all([loadTasks(boardId), loadStatuses(boardId), loadCollaborators(boardId)])
    }
    isLoading.value.board = false
  }

  async function updateBoard(boardId, boardData) {
    isLoading.value.board = true
    const res = await patchBoard(boardId, boardData)
    if (res.ok) {
      currentBoard.value = { ...currentBoard.value, ...res.data }
    } else {
      throw new Error(res.message)
    }
    isLoading.value.board = false
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
  }

  function clearBoardData() {
    currentBoard.value = null
    tasks.value.splice(0, tasks.value.length)
    statuses.value.splice(0, statuses.value.length)
    options.value.sortBy = null
    options.value.sortDirection = null
    clearTaskFilterStatus()
  }

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
    clearBoardData,
    updateBoard,
    collaborativeBoards,
    loadCollaborators,
    collaborators
  }
})
