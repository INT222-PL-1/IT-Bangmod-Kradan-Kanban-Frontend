<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue';
import ThemeSwitch from './components/ThemeSwitch.vue'
</script>

<template>
  <ToastContainer />
  <header class="sticky top-0 z-20 flex justify-between items-center bg-base-200 px-6 h-20 drop-shadow-sm">
    <div class="text-xl sm:text-2xl font-bold">IT-Bangmod Kradan Kanban</div>
    <ThemeSwitch />
    <!-- <div id="header-right"></div> -->
  </header>
  <RouterView />
</template>
