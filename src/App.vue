<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue';
import ThemeSwitch from './components/ThemeSwitch.vue'
</script>

<template>
  <ToastContainer />
  <header class="sticky top-0 z-30 flex justify-between items-center bg-base-200 px-6 h-20">
    <div class="text-xl sm:text-2xl font-bold">IT-Bangmod Kradan Kanban</div>
    <ThemeSwitch />
    <!-- <div id="header-right"></div> -->
  </header>
  <nav
    class="sticky top-20 z-20 px-4 h-12 flex justify-end items-center box-border border-b-2 border-base-300 bg-base-200 drop-shadow-md">
    <div id="navbar-item"></div>
  </nav>
  <section class="flex flex-col sm:items-center max-w-full min-h-[calc(100vh-8rem)] h-auto">
    <RouterView />
  </section>
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <aside>
      <p>Copyright © 2024 - All right reserved by Dawnbreakers Team</p>
    </aside>
  </footer>
</template>
