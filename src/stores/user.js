import { ref } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/libs/classes/User'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  function loadUserData() {
    const accessToken = localStorage.getItem('itbkk_access_token')
    user.value = new User(accessToken)
  }

  function clearUserData() {
    localStorage.removeItem('itbkk_access_token')
    localStorage.removeItem('itbkk_refresh_token')
    user.value = null
  }

  return { user, loadUserData, clearUserData }
})
