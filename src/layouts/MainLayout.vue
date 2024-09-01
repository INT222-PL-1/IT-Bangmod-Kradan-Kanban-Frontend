<script setup>
import { RouterLink } from 'vue-router'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import BackToTopButton from '@/components/BackToTopButton.vue'
import IconSVG from '@/components/IconSVG.vue'
import UserMenuButton from '@/components/UserMenuButton.vue'
import ResponsiveLogo from '@/components/ResponsiveLogo.vue'

</script>

<template>
  <BackToTopButton />
  <header class="sticky top-0 z-30 flex justify-between items-center bg-base-200 px-6 h-20">
    <ResponsiveLogo />
    <div class="flex gap-2">
      <UserMenuButton />
      <ThemeSwitch />
    </div>
  </header>
  <nav
    class="sticky top-20 z-20 px-4 h-12 flex justify-between items-center box-border border-b-2 border-base-300 bg-base-200 drop-shadow-md">
    <div class="flex gap-4">
      <div class="flex">
        <RouterLink :to="{ name: 'all-task' }" exact-active-class="bg-neutral opacity-100 "
          class="btn btn-ghost btn-sm">
          <IconSVG iconName="house" :scale="1.25" />Home
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'status-manage' }" exact-active-class="bg-neutral opacity-100"
          class="itbkk-manage-status btn btn-ghost btn-sm">
          <IconSVG iconName="sliders2-vertical" :scale="1.25" />Manage Status
        </RouterLink>
      </div>
    </div>
    <div id="navbar-item-right"></div>
  </nav>
  <section class="flex flex-col sm:items-center max-w-full min-h-[calc(100vh-8rem)] h-auto">
    <RouterView />
  </section>
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <aside>
      <p>Copyright © 2024 - All right reserved by Dawnbreakers Team</p>
    </aside>
  </footer>
</template>
