import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/libs/classes/User'
import { useBoardStore } from './board'
import Pl1AccessRight from '@/libs/enum/Pl1AccessRight'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isUserLoaded = computed(() => user.value !== null)

  const boardStore = useBoardStore()
  const isOwnerOfCurrentBoard = computed(() => boardStore.currentBoard?.owner.oid === user.value?.oid)
  const hasWriteAccessOnCurrentBoard = computed(() => boardStore.collaborators?.some(c => c.oid === user.value?.oid && c.accessRight === Pl1AccessRight.WRITE) || isOwnerOfCurrentBoard.value)

  function loadUserData() {
    const accessToken = localStorage.getItem('itbkk_access_token')
    user.value = new User(accessToken)
  }

  function clearUserData() {
    // console.log('Clearing user data')
    // alert('Clearing user data')
    boardStore.clearBoardData()
    localStorage.removeItem('itbkk_access_token')
    localStorage.removeItem('itbkk_refresh_token')
    user.value = null
  }

  return { user, isUserLoaded, loadUserData, clearUserData, isOwnerOfCurrentBoard, hasWriteAccessOnCurrentBoard }
})
