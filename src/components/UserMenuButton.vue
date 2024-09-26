<script setup>
import { useRouter } from 'vue-router';
import BaseMenu from './BaseMenu.vue';
import IconSVG from './IconSVG.vue';
import { useUserStore } from '@/stores/user';

const router = useRouter()
const userStore = useUserStore()

const handleSignButtonClick = () => {
  if (userStore.user) userStore.clearUserData()
  router.push({ name: 'login'})
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
      <button @click="handleSignButtonClick" class="btn btn-ghost btn-sm flex gap-4 w-full justify-start">
        <IconSVG :iconName="userStore.user ? 'box-arrow-left' : 'box-arrow-in-right'" scale="1.5" size="1.5" />
        <div>Sign {{ userStore.user ? 'Out' : 'In' }}</div>
      </button>
    </template>
  </BaseMenu>
</template>


<style scoped>

</style>
