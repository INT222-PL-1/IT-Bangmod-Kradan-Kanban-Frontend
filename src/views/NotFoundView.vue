<script setup>
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { RouterLink } from 'vue-router'

</script>

<template>
  <div class="fixed top-4 right-4">
    <ThemeSwitch />
  </div>
  <div class="flex flex-col justify-center items-center h-screen gap-4">
    <div class="text-center">
      <div class="text-8xl font-bold tracking-wider">404</div>
      <div class="text-2xl">Page not found</div>
    </div>
    <div class="text-xl">Click <RouterLink :to="{ name: 'all-board' }"><span class="text-primary">here</span></RouterLink> to go back to
      the home page.</div>
  </div>
</template>

<style scoped></style>
