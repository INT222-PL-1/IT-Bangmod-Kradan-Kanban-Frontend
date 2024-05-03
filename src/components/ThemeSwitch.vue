<script setup>
import { onMounted, ref, watch } from 'vue';
import BaseMenu from './BaseMenu.vue';

let themeSetting = ''
const isSystemDark = ref(false)

function themeSetup() {
  themeSetting = localStorage.getItem('theme') || 'system'
  const html = document.documentElement
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkQuery.addEventListener('change', (e) => {
    isSystemDark.value = e.matches
  })

  if (themeSetting === 'dark') {
    html.dataset.theme = 'itbkk-dark'
  } else if (themeSetting === 'light') {
    html.dataset.theme = 'itbkk-light'
  } else {
    html.dataset.theme = darkQuery.matches ? 'itbkk-dark' : 'itbkk-light'
  }
}

watch(isSystemDark, (value) => {
  if (themeSetting !== 'system') return
  const html = document.documentElement
  html.dataset.theme = value ? 'itbkk-dark' : 'itbkk-light'
}, { immediate: true })

onMounted(() => {
  themeSetup()
})

const handleSetTheme = (theme) => {
  localStorage.setItem('theme', theme)
  themeSetup()
}

</script>

<template>
  <BaseMenu>
    <template #icon>
      test
    </template>
    <template #menu>
      <button @click="handleSetTheme('system')">System</button>
      <button @click="handleSetTheme('light')">Light</button>
      <button @click="handleSetTheme('dark')">Dark</button>
    </template>
  </BaseMenu>
</template>

<style scoped></style>