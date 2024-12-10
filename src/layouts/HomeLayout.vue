<script setup>
import ResponsiveLogo from '@/components/ResponsiveLogo.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import UserMenuButton from '@/components/UserMenuButton.vue'
import { useUserStore } from '@/stores/user'

const emits = defineEmits(['clickSignOut', 'clickLogin'])

const userStore = useUserStore()

const handleSignButtonClick = async () => {
  if (userStore.user) {
    emits('clickSignOut')
  } else {
    emits('clickLogin')
  }
}

</script>

<template>
  <header class="h-[5rem] top-0 sticky flex justify-between items-center px-6 bg-base-300 shadow-md z-20">
    <ResponsiveLogo type="compact" />
    <div class="flex">
      <ThemeSwitch />
      <UserMenuButton @clickSignButton="handleSignButtonClick" />
    </div>
  </header>
  <section class="flex flex-col sm:items-center max-w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] h-auto">
    <slot></slot>
  </section>
  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <aside>
      <p>Copyright © 2024 - All right reserved by Dawnbreakers Team</p>
    </aside>
  </footer>
</template>

<style scoped>

</style>
