import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { graphScopes } from '@/configs/authConfig'
import { useUserStore } from './user'
import router from '@/router'

export const useMsalStore = defineStore('msal', () => {
  const msalInstance = ref(null)
  const activeAccount = ref(null)
  const userStore = useUserStore()
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  /**
   * Initialize MSAL instance
   * @param {import('@azure/msal-browser').Configuration} config
   */
  async function initializeMsal(config) {
    if (msalInstance.value) {
      // console.warn('MSAL instance already initialized')
      return
    }
    try {
      msalInstance.value = new PublicClientApplication(config)
      await msalInstance.value.initialize()
    } catch (error) {
      console.error('MSAL initialization failed', error)
    }
  }

  function setActiveAccount(account) {
    activeAccount.value = account
    msalInstance.value.setActiveAccount(account)
    isAuthenticated.value = true
    userStore.loadUserData(account.idToken)
  }

  /**
   * Login using redirect flow
   */
  async function loginMS() {
    try {
      isLoading.value = true
      const response = await msalInstance.value.loginPopup({
        scopes: graphScopes.scopes,
      })
      if (response) {
        activeAccount.value = response.account
        setActiveAccount(response.account)
        userStore.loadUserData(response.account.idToken)
        router.push({ name: 'all-board' })
      }
    } catch (error) {
      console.error('Login failed', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout the current user using redirect flow
   * @param {string} postLogoutRedirectUri - Where to redirect the user after logout
   */
  async function signOutMS() {
    const account = msalInstance.value.getActiveAccount()
    if (!account) {
      console.warn('No active account found for logout')
      return
    }
    await msalInstance.value.logoutPopup()
    userStore.clearUserData()
    router.push({ name: 'login' })
  }

  /**
   * Acquire an access token for the active account
   */
  async function acquireToken() {
    const account = msalInstance.value.getActiveAccount()
    if (!account) {
      console.warn('No active account found for token acquisition')
      return
    }

    const request = {
      scopes: graphScopes.scopes,
      account,
    }

    try {
      const response = await msalInstance.value.acquireTokenSilent(request)
      
      if (response) {
        setActiveAccount(response.account)
      }
    } catch (error) {
      console.error('Silent token acquisition failed', error)

      if (error instanceof InteractionRequiredAuthError) {
        // Fallback to an interactive token acquisition
        try {
          await msalInstance.value.acquireTokenPopup(request)
        } catch (interactiveError) {
          console.error('Interactive token acquisition failed', interactiveError)
        }
      }
    }
  }

  async function ssoSilent() {
    try {
      const response = await msalInstance.value.ssoSilent({
        scopes: graphScopes.scopes
      })
      if (response) {
        setActiveAccount(response.account)
      }
    } catch (error) {
      console.error('Silent SSO failed', error)
    }
  }

  return {
    msalInstance,
    activeAccount,
    isAuthenticated,
    isLoading,
    initializeMsal,
    loginMS,
    signOutMS,
    acquireToken,
    ssoSilent,
  }
})
