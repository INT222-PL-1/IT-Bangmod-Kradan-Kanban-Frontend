import { ref } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/libs/classes/User'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  function loadUserData() {
    const accessToken = localStorage.getItem('itbkk-token')
    user.value = new User(accessToken)
  }

  function clearUserData() {
    localStorage.removeItem('itbkk-token')
    user.value = null
  }

  return { user, loadUserData, clearUserData }
})
