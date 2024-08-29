<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import zyos from 'zyos'

zyos.defineConfig({
  defaultTokenGetter: () => localStorage.getItem('itbkk-token'),
  defaultHeaders: {
    'test': 'test',
  },
})
</script>


<template>
  <ToastContainer />
  <RouterView />
</template>
