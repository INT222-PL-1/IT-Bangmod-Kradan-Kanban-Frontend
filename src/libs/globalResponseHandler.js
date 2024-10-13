import router from "@/router"
import { useToastStore } from "@/stores/toast"
import Pl1ErrorTypes from "./enum/Pl1ErrorTypes"
import { refreshAccessToken } from "./userManagement"


const globalResponseHandler = async (response) => {
  const toastStore = useToastStore()

  if (response.statusCode === 401) {
    if (router.currentRoute.value.name === 'login') return
    // localStorage.removeItem('itbkk_access_token')
    if ([
      Pl1ErrorTypes.TOKEN_EXPIRED,
      Pl1ErrorTypes.TOKEN_MALFORMED,
      Pl1ErrorTypes.TOKEN_NOT_BEGIN_WITH_BEARER,
      Pl1ErrorTypes.TOKEN_TEMPERED
    ].includes(response.data.type)) {

      // TODO: Implement refresh token

      // toastStore.createToast({
      //   title: 'Error',
      //   description: 'Your authentication has expired.\nPlease login again.',
      //   status: 'error',
      //   delay: 500,
      // })
      // router.push({ name: 'login' })
      // console.log('Token malformed')
      
      try {
        const refreshToken = localStorage.getItem('itbkk_refresh_token')
        const res = await refreshAccessToken(refreshToken)
        if (res.status === 'success') {
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
  } else if (response.statusCode === 403) {
    console.log('Forbidden')
    router.push({ name: 'forbidden' })
  } else if (response.statusCode === 404) {
    console.log('Not found')
    router.push({ name: 'not-found' })
  }
}

export default globalResponseHandler
