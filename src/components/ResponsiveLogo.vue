<script setup lang="ts">
import IconSVG from './IconSVG.vue'

defineProps({
  type: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'compact'].includes(value)
  }
})
</script>

<template>
  <RouterLink :to="{ name: 'all-board' }" class="cursor-pointer active:scale-95 transition-transform">
    <div v-if="type === 'normal'" class="flex gap-3">
      <IconSVG iconName="itbkk-logo" size="2rem" scale="2" />
      <div class="hidden sm:block sm:text-2xl font-bold">IT-Bangmod Kradan Kanban</div>
      <div class="text-xl block sm:hidden font-bold">ITBKK</div>
    </div>
    <div v-else-if="type === 'compact'" class="flex gap-3">
      <IconSVG iconName="itbkk-logo" size="2rem" scale="2" />
      <div class="hidden sm:block sm:text-2xl font-bold">ITBKK</div>
    </div>
  </RouterLink>
</template>
