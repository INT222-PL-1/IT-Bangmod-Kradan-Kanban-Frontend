import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { graphScopes } from '@/configs/authConfig'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
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
      console.warn('MSAL instance already initialized')
      return
    }
    try {
      msalInstance.value = new PublicClientApplication(config)
      console.log('MSAL instance initialized', msalInstance.value)
      await msalInstance.value.initialize()
      await handleRedirect()
      setActiveAccount()
    } catch (error) {
      console.error('MSAL initialization failed', error)
    }
  }

  /**
   * Handle redirect response after login or token refresh
   */
  async function handleRedirect() {
    isLoading.value = true
    console.log('handleRedirect called')
    try {
      const response = await msalInstance.value.handleRedirectPromise()
      console.log('Response from handleRedirect', response)
      if (response) {
        console.log('Redirect response', response)
        activeAccount.value = response.account
        isAuthenticated.value = true
        userStore.loadUserData(response.account.idToken)
        console.log('User data loaded after redirect', userStore.user)
      }
      console.log('handleRedirect completed successfully')
    } catch (error) {
      console.error('Error handling redirect', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set the active account in the store
   */
  function setActiveAccount() {
    activeAccount.value = msalInstance.value.getActiveAccount()
    isAuthenticated.value = !!activeAccount.value
  }


  // const test = new PublicClientApplication()
  // test.handleRedirectPromise()
  /**
   * Login using redirect flow
   */
  async function loginMS(redirectUri = window.location.origin + '/pl1/login') {
    try {
      isLoading.value = true
      await msalInstance.value.loginRedirect({
        scopes: graphScopes.scopes,
        redirectUri
      })
    } catch (error) {
      console.error('Login failed', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout the current user using redirect flow
   * @param {string} postLogoutRedirectUri - Where to redirect the user after logout
   */
  function logoutMS(postLogoutRedirectUri = window.location.origin + '/pl1/login') {
    const account = msalInstance.value.getActiveAccount()
    console.log('Logging out account', account)
    if (!account) {
      console.warn('No active account found for logout')
      return
    }
    msalInstance.value.logoutRedirect({
      account,
      postLogoutRedirectUri,
    })
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
      console.log('Token acquired', response)
      return response.accessToken
    } catch (error) {
      console.error('Silent token acquisition failed', error)

      if (error instanceof InteractionRequiredAuthError) {
        // Fallback to an interactive token acquisition
        try {
          await msalInstance.value.acquireTokenRedirect(request)
        } catch (interactiveError) {
          console.error('Interactive token acquisition failed', interactiveError)
        }
      }
    }
  }

  return {
    msalInstance,
    activeAccount,
    isAuthenticated,
    isLoading,
    initializeMsal,
    loginMS,
    logoutMS,
    handleRedirect,
    acquireToken,
  }
})
