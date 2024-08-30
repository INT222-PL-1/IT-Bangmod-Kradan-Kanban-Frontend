<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import zyos from 'zyos'

zyos.defineConfig({
  defaultTokenGetter: () => `Bearer ${localStorage.getItem('itbkk-token')}`
})
</script>


<template>
  <ToastContainer />
  <RouterView />
</template>
