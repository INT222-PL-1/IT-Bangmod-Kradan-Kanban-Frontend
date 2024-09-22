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
  }
}

export default globalResponseHandler