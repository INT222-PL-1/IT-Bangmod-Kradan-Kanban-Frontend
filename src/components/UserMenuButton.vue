<script setup>
import { useRouter } from 'vue-router';
import BaseMenu from './BaseMenu.vue';
import IconSVG from './IconSVG.vue';
import { useUserStore } from '@/stores/user';

const router = useRouter()
const userStore = useUserStore()

const handleSignOutClick = () => {
  localStorage.removeItem('itbkk-token')
  router.push({ name: 'login'})
}
</script>

<template>
  <BaseMenu side="left" mode="button">
        <template #button>
          <button class="btn btn-ghost btn-sm">
            <div class="flex gap-3">
              <IconSVG iconName="person-circle" scale="1.5" size="1.5" />
              <div class="itbkk-fullname">{{ userStore.user.name }}</div>
            </div>
          </button>
        </template>
        <template #menu>
          <button @click="handleSignOutClick" class="btn btn-ghost btn-sm flex gap-4 w-full justify-start">
            <IconSVG iconName="box-arrow-left" scale="1.5" size="1.5" />
            <div>Sign Out</div>
          </button>
        </template>
      </BaseMenu>
</template>

<style scoped>

</style>