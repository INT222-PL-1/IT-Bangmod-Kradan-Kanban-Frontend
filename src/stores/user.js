import { ref } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/libs/classes/User'
import { useBoardStore } from './board'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const boardStore = useBoardStore()

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

  return { user, loadUserData, clearUserData }
})
