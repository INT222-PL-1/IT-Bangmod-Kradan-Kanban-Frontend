<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>
  <div class="flex flex-col justify-center items-center h-[24rem] gap-4">
    <div class="text-center">
      <div class="text-8xl font-bold tracking-wider">404</div>
      <div class="text-2xl">Page not found</div>
    </div>
    <div class="text-xl">Click <RouterLink to="/task"><span class="text-primary">here</span></RouterLink> to go back to
      the home page.</div>
  </div>
</template>

<style scoped></style>
