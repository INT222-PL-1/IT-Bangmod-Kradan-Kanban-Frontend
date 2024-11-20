<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import zyos from 'zyos'
import globalResponseHandler from './libs/globalResponseHandler';
import DebugUI from './components/debug/DebugUI.vue';

zyos.defineConfig({
  alwaysUseToken: true,
  defaultTokenGetter: () => {
    const token = localStorage.getItem('itbkk_access_token')
    if (token) return `Bearer ${token}`
    return null
  },
  logging: 'none',
  globalResponseHandler: globalResponseHandler
})

const DEBUG_MODE = import.meta.env.VITE_DEBUG === 'true'
</script>


<template>
  <DebugUI v-if="DEBUG_MODE" />
  <ToastContainer />
  <RouterView />
</template>
