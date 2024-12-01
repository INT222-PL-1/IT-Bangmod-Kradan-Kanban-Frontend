import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import zyos from 'zyos'
import globalResponseHandler from './libs/globalResponseHandler'
import { useMsalStore } from './stores/msal'
import { msalConfig } from './configs/authConfig'

const app = createApp(App)
app.use(createPinia())

const userStore = useUserStore()
const msalStore = useMsalStore()

zyos.defineConfig({
  alwaysUseToken: true,
  defaultTokenGetter: () => {
    let token = null
    if (userStore.isMSAuthenticated) {
      token = userStore.user.idToken
    } else {
      token = localStorage.getItem('itbkk_access_token')
    }
    if (token) return `Bearer ${token}`
    return null
  },
  logging: 'none',
  globalResponseHandler: globalResponseHandler
})

const initialApp = async () => {
  await msalStore.initializeMsal(msalConfig)
  await msalStore.ssoSilent()
  app.use(router)
  app.mount('#app')
}

initialApp()
