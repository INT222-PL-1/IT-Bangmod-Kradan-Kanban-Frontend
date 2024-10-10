<script setup lang="ts">
import { computed } from 'vue';
import IconSVG from './IconSVG.vue'
import { useThemeStore } from '@/stores/theme';

defineProps({
  type: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'compact'].includes(value)
  }
})

const themeStore = useThemeStore()

const festivalLogoName = computed(() => {
  if (themeStore.isFestivalMonth) return `${themeStore.festivalName}-itbkk-logo`
  return 'itbkk-logo'
})
</script>

<template>
  <RouterLink :to="{ name: 'all-board' }" class="cursor-pointer active:scale-95 transition-transform">
    <div v-if="type === 'normal'" class="flex gap-3">
      <IconSVG v-if="themeStore.festivalThemeState" :iconName="festivalLogoName" size="2rem" scale="2" />
      <IconSVG v-else iconName="itbkk-logo" size="2rem" scale="2" />
      <div class="hidden sm:block sm:text-2xl font-bold">IT-Bangmod Kradan Kanban</div>
      <div class="text-xl block sm:hidden font-bold">ITBKK</div>
    </div>
    <div v-else-if="type === 'compact'" class="flex gap-3">
      <IconSVG v-if="themeStore.festivalThemeState" :iconName="festivalLogoName" size="2rem" scale="2" />
      <IconSVG v-else iconName="itbkk-logo" size="2rem" scale="2" />
      <div class="hidden sm:block sm:text-2xl font-bold">ITBKK</div>
    </div>
  </RouterLink>
</template>
