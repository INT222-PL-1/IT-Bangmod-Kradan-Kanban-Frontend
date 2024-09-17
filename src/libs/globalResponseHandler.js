import router from "@/router"

const globalResponseHandler = (response) => {
  if (response.statusCode === 401) {
    if (router.currentRoute.name === 'login') return
    localStorage.removeItem('itbkk-token')
    router.push({ name: 'login' })
  }
}

export default globalResponseHandler