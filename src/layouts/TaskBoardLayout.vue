<script setup>
import { RouterLink, useRouter } from 'vue-router'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import BackToTopButton from '@/components/BackToTopButton.vue'
import IconSVG from '@/components/IconSVG.vue'
import UserMenuButton from '@/components/UserMenuButton.vue'
import ResponsiveLogo from '@/components/ResponsiveLogo.vue'
import { useBoardStore } from '@/stores/board'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const boardStore = useBoardStore()
const userStore = useUserStore()

const sidebarOpenState = ref(false)
const handleSignButtonClick = () => {
  if (userStore.user) userStore.clearUserData()
  router.push({ name: 'login' })
}
</script>

<template>
  <BackToTopButton />
  <aside class="sm:hidden fixed z-50 w-screen" :class="{ 'pointer-events-none': sidebarOpenState === false }">
    <div @click="sidebarOpenState = false"
      class="absolute w-screen h-screen bg-[#0005] backdrop-blur-sm transition duration-1000"
      :class="sidebarOpenState ? 'opacity-100' : 'opacity-0'"></div>
    <div
      class="absolute w-[90vw] max-w-[20rem] h-screen flex flex-col bg-base-300 overflow-hidden transition duration-1000"
      :class="sidebarOpenState ? 'translate-x-[0%]' : 'translate-x-[-100%]'">
      <div class="bg-base-200 p-4 flex flex-col gap-4">
        <!-- <IconSVG iconName="itbkk-logo" scale="3" size="3rem" />
        <div class="text-3xl font-bold">ITBKK</div> -->
        <div class="flex justify-between">
          <IconSVG iconName="person-circle" scale="4" size="4rem" />
          <IconSVG iconName="itbkk-logo" scale="1.5" size="1.5rem" />
        </div>
        <div class="text-xl font-bold">{{ userStore.user ? userStore.user.name : 'Guest' }}</div>
      </div>
      <!-- <div class="divider"></div> -->
      <div class="flex flex-col p-4 gap-2">
        <RouterLink :to="{ name: 'all-board' }" exact-active-class="bg-neutral opacity-100"
          class="btn btn-ghost justify-start gap-4">
          <IconSVG iconName="house" :scale="1.25" />Home
        </RouterLink>
        <RouterLink :to="{ name: 'all-task' }" exact-active-class="bg-neutral opacity-100"
          class="btn btn-ghost justify-start gap-4">
          <IconSVG iconName="kanban" :scale="1.25" />Task Board
        </RouterLink>
        <RouterLink :to="{ name: 'status-manage' }" exact-active-class="bg-neutral opacity-100"
          class="btn btn-ghost justify-start gap-4">
          <IconSVG iconName="sliders2-vertical" :scale="1.25" />Manage Status
        </RouterLink>
        <div class="divider"></div>
        <button @click="handleSignButtonClick" class="btn btn-ghost justify-start gap-4">
          <IconSVG :iconName="userStore.user ? 'box-arrow-left' : 'box-arrow-in-right'" :scale="1.25" />
          Sign {{ userStore.user ? 'Out' : 'In' }}
        </button>
      </div>
    </div>
  </aside>
  <header class="block sm:hidden sticky top-0 z-30">
    <div class="flex gap-3 items-center bg-base-300 px-6 h-[4rem]">
      <button class="btn btn-square btn-ghost btn-sm">
        <IconSVG iconName="list" scale="2" size="2rem" @click="sidebarOpenState = true" />
      </button>
      <div class="truncate text-lg">{{ boardStore.currentBoard?.name }}</div>
    </div>
  </header>

  <header class="hidden sm:block sticky top-0 z-30">
    <div class="flex justify-between items-center bg-base-300 px-6 h-[5rem]">
      <div class="flex items-center gap-2">
        <ResponsiveLogo type="compact" />
        <div class="text-secondary">
          <IconSVG iconName="chevron-right" :scale="1" />
        </div>
        <div class="text-xl truncate max-w-[45vw]" :title="boardStore.currentBoard?.name">{{
          boardStore.currentBoard?.name }}</div>
      </div>
      <div class="flex gap-2">
        <ThemeSwitch />
        <UserMenuButton />
      </div>
    </div>
  </header>
  <nav class="hidden sm:flex sticky top-[5rem] z-20 px-4 h-[3rem] justify-between items-center bg-base-300 shadow-md">
    <div class="flex gap-4">
      <div class="flex">
        <RouterLink :to="{ name: 'all-board' }" exact-active-class="bg-neutral opacity-100"
          class="btn btn-ghost btn-sm">
          <IconSVG iconName="house" :scale="1.25" />Home
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'all-task' }" exact-active-class="bg-neutral opacity-100 nav-selected"
          class="btn btn-ghost btn-sm">
          <IconSVG iconName="kanban" :scale="1.25" className="nav-icon" />
          <IconSVG iconName="kanban-fill" :scale="1.25" className="nav-icon-selected" />
          Task Board
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'status-manage' }" exact-active-class="bg-neutral opacity-100 nav-selected"
          class="itbkk-manage-status btn btn-ghost btn-sm">
          <IconSVG iconName="tags" :scale="1.25" className="nav-icon" />
          <IconSVG iconName="tags-fill" :scale="1.25" className="nav-icon-selected" />
          Manage Status
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'collab-manage' }" exact-active-class="bg-neutral opacity-100 nav-selected"
          class="itbkk-manage-collaborator btn btn-ghost btn-sm">
          <IconSVG iconName="people" :scale="1.25" className="nav-icon" />
          <IconSVG iconName="people-fill" :scale="1.25" className="nav-icon-selected" />
          Manage Collaborators
        </RouterLink>
      </div>
    </div>
    <div id="navbar-item-right"></div>
  </nav>
  <section class="flex flex-col sm:items-center max-w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-8rem)] h-auto">
    <RouterView />
  </section>
  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <aside>
      <p>Copyright © 2024 - All right reserved by Dawnbreakers Team</p>
    </aside>
  </footer>
</template>

<style scoped>
.nav-icon-selected {
  display: none;
}

.nav-selected .nav-icon {
  display: none;
}

.nav-selected .nav-icon-selected {
  display: block;
}
</style>
