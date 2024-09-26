import router from "@/router"
import { useToastStore } from "@/stores/toast"
import Pl1ErrorTypes from "./enum/Pl1ErrorTypes"


const globalResponseHandler = (response) => {
  const toastStore = useToastStore()

  if (response.statusCode === 401) {
    if (router.currentRoute.value.name === 'login') return
    localStorage.removeItem('itbkk-token')
    if (response.data.type === Pl1ErrorTypes.TOKEN_EXPIRED) {
      toastStore.createToast({
        title: 'Error',
        description: 'Your authentication has expired.\nPlease login again.',
        status: 'error',
        delay: 500,
      })
      router.push({ name: 'login' })
    } else if (response.data.type === Pl1ErrorTypes.UNAUTHORIZED_UPDATE) {
      toastStore.createToast({
        title: 'Error',
        description: 'You are not authorized to do this action.',
        status: 'error',
      })
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'Your authentication has failed.\nPlease login again.',
        status: 'error',
        delay: 500,
      })
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
