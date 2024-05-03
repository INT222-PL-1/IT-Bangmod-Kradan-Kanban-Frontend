<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue';
</script>

<template>
  <ToastContainer />
  <header>
    <div class="text-lg sm:text-3xl font-bold py-6 bg-base-200 text-center">IT-Bangmod Kradan Kanban</div>
  </header>
  <RouterView />
</template>
