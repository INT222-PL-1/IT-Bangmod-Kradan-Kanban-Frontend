<script setup>
import BaseMenu from './BaseMenu.vue';
import IconSVG from './IconSVG.vue';
import { useUserStore } from '@/stores/user';
import FestivalThemeSwitch from './festival/FestivalThemeSwitch.vue';
import { useThemeStore } from '@/stores/theme';

const emits = defineEmits(['clickSignButton'])

const userStore = useUserStore()
const themeStore = useThemeStore()

const handleSignButtonClick = () => {
  emits('clickSignButton')
}
</script>

<template>
  <BaseMenu side="left" mode="button">
    <template #button>
      <button class="btn btn-ghost btn-sm">
        <div class="flex gap-3">
          <IconSVG iconName="person-circle" scale="1.5" size="1.5" />
          <div class="itbkk-fullname">{{ userStore.user ? userStore.user.name : 'Guest' }}</div>
        </div>
      </button>
    </template>
    <template #menu>
      <div v-if="themeStore.isFestivalMonth">
        <FestivalThemeSwitch />
        <div class="divider"></div>
      </div>
      <button @click="handleSignButtonClick" class="btn btn-ghost btn-sm flex gap-4 w-full justify-start">
        <IconSVG :iconName="userStore.user ? 'box-arrow-left' : 'box-arrow-in-right'" scale="1.5" size="1.5" />
        <div>Sign {{ userStore.user ? 'Out' : 'In' }}</div>
      </button>
    </template>
  </BaseMenu>
</template>


<style scoped>

</style>
