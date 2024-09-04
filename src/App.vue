<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import zyos from 'zyos'

zyos.defineConfig({
  alwaysUseToken: true,
  defaultTokenGetter: () => `Bearer ${localStorage.getItem('itbkk-token')}`,
  logging: 'none'
})
</script>


<template>
  <ToastContainer />
  <RouterView />
</template>
