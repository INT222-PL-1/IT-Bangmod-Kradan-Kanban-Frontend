import router from "@/router"
import { useToastStore } from "@/stores/toast"
import Pl1ErrorTypes from "./enum/Pl1ErrorTypes"
import { refreshAccessToken } from "./userManagement"
import { useUserStore } from "@/stores/user"
import { HttpStatusCode } from "zyos"


const globalResponseHandler = async (response) => {
  const toastStore = useToastStore()
  const userStore = useUserStore()

  if (response.statusCode === HttpStatusCode.UNAUTHORIZED) {
    if (router.currentRoute.value.name === 'login') return
    // localStorage.removeItem('itbkk_access_token')
    if ([
      Pl1ErrorTypes.TOKEN_EXPIRED,
      Pl1ErrorTypes.TOKEN_MALFORMED,
      Pl1ErrorTypes.TOKEN_NOT_BEGIN_WITH_BEARER,
      Pl1ErrorTypes.TOKEN_TEMPERED
    ].includes(response.data.type)) {

      try {
        const refreshToken = localStorage.getItem('itbkk_refresh_token')
        const res = await refreshAccessToken(refreshToken)
        if (res.ok) {
          localStorage.setItem('itbkk_access_token', res.data.access_token)
        }
      } catch (error) {
        console.error(error)
      }

    } else if (response.data.type === Pl1ErrorTypes.UNAUTHORIZED_UPDATE) {
      toastStore.createToast({
        title: 'Error',
        description: 'You are not authorized to do this action.',
        status: 'error',
      })
    } else if (response.data.type === Pl1ErrorTypes.REFRESH_TOKEN_INVALID) {
      toastStore.createToast({
        title: 'Error',
        description: 'Your authentication has expired.\nPlease login again.',
        status: 'error',
        delay: 500,
      })
      localStorage.removeItem('itbkk_refresh_token')
      router.push({ name: 'login' })
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'Your authentication has failed.\nPlease login again.',
        status: 'error',
        delay: 500,
      })
      localStorage.removeItem('itbkk_refresh_token')
      router.push({ name: 'login' })
    }
  } else if (response.statusCode === HttpStatusCode.FORBIDDEN) {
    router.push({ name: 'forbidden' })
  } else if (response.statusCode === HttpStatusCode.NOT_FOUND) {
    if ([
      Pl1ErrorTypes.USER_EMAIL_NOT_FOUND,
      Pl1ErrorTypes.COLLABORATOR_NOT_FOUND
    ].includes(response.data.type)) {
      return
    } else {
      router.push({ name: 'not-found' })
    }
  } else if (response.statusCode === HttpStatusCode.INTERNAL_SERVER_ERROR) {
    userStore.clearUserData()
    toastStore.createToast({
      title: 'Error',
      description: 'An unexpected error occurred.\nPlease login and try again later.',
      status: 'error',
      delay: 500,
    })
    router.push({ name: 'login' })
  }
}

export default globalResponseHandler
