<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import zyos from 'zyos'
import globalResponseHandler from './libs/globalResponseHandler';
import DebugUI from './components/debug/DebugUI.vue';

zyos.defineConfig({
  alwaysUseToken: true,
  defaultTokenGetter: () => `Bearer ${localStorage.getItem('itbkk-token')}`,
  logging: 'none',
  globalResponseHandler: globalResponseHandler
})
</script>


<template>
  <DebugUI />
  <ToastContainer />
  <RouterView />
</template>
