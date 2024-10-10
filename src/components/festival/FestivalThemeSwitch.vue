<script setup>
import { useThemeStore } from '@/stores/theme';
import { onMounted, watch } from 'vue'

const themeStore = useThemeStore()

onMounted(() => {

  const festivalThemeState = localStorage.getItem('itbkk_festival_theme')
  if (festivalThemeState !== null) {
    themeStore.setFestivalThemeState(festivalThemeState === 'true')
  } else {
    localStorage.setItem('itbkk_festival_theme', 'true')
    themeStore.setFestivalThemeState(true)
  }
})

watch(() => themeStore.festivalThemeState, (newVal) => {
  localStorage.setItem('itbkk_festival_theme', newVal)
  themeStore.setFestivalThemeState(newVal)
})

</script>

<template>
  <div class="flex justify-between items-center h-8 px-3">
    <div>Festival Theme</div>
    <input v-model="themeStore.festivalThemeState" type="checkbox" class="toggle">
  </div>
</template>

<style scoped>

</style>