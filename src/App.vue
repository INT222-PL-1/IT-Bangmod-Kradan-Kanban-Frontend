<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue';
</script>

<template>
  <ToastContainer />
  <header>
    <div class="flex justify-center">
      <div class="text-lg sm:text-3xl font-bold py-6">IT-Bangmod Kradan Kanban</div>
    </div>
    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/task">Task</RouterLink>
    </nav> -->
  </header>
  <RouterView />
</template>
