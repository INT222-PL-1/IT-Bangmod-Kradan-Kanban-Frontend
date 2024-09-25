import router from "@/router"
import { useToastStore } from "@/stores/toast"


const globalResponseHandler = (response) => {
  const toastStore = useToastStore()

  if (response.statusCode === 401) {
    if (router.currentRoute.name === 'login') return
    localStorage.removeItem('itbkk-token')
    router.push({ name: 'login' })
    toastStore.createToast({
      title: 'Error',
      description: 'Your authentication has expired.\nPlease login again.',
      status: 'error',
      delay: 500,
    })
  } else if (response.statusCode === 403) {
    console.log('Forbidden')
    router.push({ name: 'forbidden' })
  } else if (response.statusCode === 404) {
    console.log('Not found')
    router.push({ name: 'not-found' })
  }
}

export default globalResponseHandler
