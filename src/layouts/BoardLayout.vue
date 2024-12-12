<script setup>
import { RouterLink, useRoute } from 'vue-router'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import BackToTopButton from '@/components/BackToTopButton.vue'
import IconSVG from '@/components/IconSVG.vue'
import UserMenuButton from '@/components/UserMenuButton.vue'
import ResponsiveLogo from '@/components/ResponsiveLogo.vue'
import { useBoardStore } from '@/stores/board'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import GhostHaunting from '@/components/festival/halloween/GhostHaunting.vue'
import useIntersectionObserver from '@/composables/useIntersectionObserver'
import BaseMenu from '@/components/BaseMenu.vue'

const emits = defineEmits(['clickSignOut', 'clickLogin'])

const route = useRoute()
const boardStore = useBoardStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

const mobileNavContainer = ref(null)
const intersectElements = ref([])
const collabBtn = ref(null)
const statusBtn = ref(null)

const sidebarOpenState = ref(false)
const handleSignButtonClick = async () => {
  if (userStore.user) {
    sidebarOpenState.value = false
    emits('clickSignOut')
  } else {
    emits('clickLogin')
  }
}

function intersectCallback(entry) {
  if (!entry.isIntersecting) {
    intersectElements.value.push(entry.target)
  } else {
    intersectElements.value = intersectElements.value.filter(el => el !== entry.target)
  }
}

onMounted(() => {
  nextTick(() => {
    useIntersectionObserver.observeElement(collabBtn.value.$el, intersectCallback, {
      root: mobileNavContainer.value,
      threshold: 0.75
    })
    useIntersectionObserver.observeElement(statusBtn.value.$el, intersectCallback, {
      root: mobileNavContainer.value,
      threshold: 0.75
    })
  })
})

watch(() => route.name, () => {
  sidebarOpenState.value = false
})

</script>

<template>
  <div v-if="themeStore.festivalThemeState && themeStore.festivalName === 'halloween'">
    <GhostHaunting />
  </div>
  <BackToTopButton />

  <!-- ? Mobile UI -->
  <aside class="sm:hidden fixed z-50 w-screen" :class="{ 'pointer-events-none': sidebarOpenState === false }">
    <div @click="sidebarOpenState = false"
      class="absolute w-screen h-screen bg-[#0005] backdrop-blur-sm transition"
      :class="sidebarOpenState ? 'opacity-100' : 'opacity-0'"></div>
    <div
      class="absolute w-[90vw] max-w-[20rem] h-screen flex flex-col bg-base-300 overflow-hidden transition"
      :class="sidebarOpenState ? 'translate-x-[0%]' : 'translate-x-[-100%]'">
      <div class="bg-base-200 p-4 flex flex-col gap-4">
        <div class="flex justify-between">
          <IconSVG iconName="person-circle" scale="4" size="4rem" />
          <IconSVG iconName="itbkk-logo" scale="1.5" size="1.5rem" />
        </div>
        <div class="text-xl font-bold">{{ userStore.user ? userStore.user.name : 'Guest' }}</div>
      </div>
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
        <RouterLink :to="{ name: 'collab-manage' }" exact-active-class="bg-neutral opacity-100"
          class="btn btn-ghost justify-start gap-4">
          <IconSVG iconName="people" :scale="1.25" />Collaborator
        </RouterLink>
        <div class="divider"></div>
        <ThemeSwitch mode="toggle" />
        <button @click="handleSignButtonClick" class="btn btn-ghost justify-start gap-4">
          <IconSVG :iconName="userStore.user ? 'box-arrow-left' : 'box-arrow-in-right'" :scale="1.25" />
          Sign {{ userStore.user ? 'Out' : 'In' }}
        </button>
      </div>
    </div>
  </aside>
  <header class="block sm:hidden sticky top-0 z-30">
    <div class="flex gap-3 items-center bg-base-300 px-4 h-[4rem] relative">
      <button @click="sidebarOpenState = true" class="btn btn-square btn-outline btn-sm">
        <IconSVG iconName="list" scale="1.5" size="1.5rem" />
      </button>
      <IconSVG iconName="itbkk-logo" scale="2.25" size="2.25rem" />
      <div class="w-9/12">
        <div class="opacity-60">
          <span class="truncate text-sm">{{ boardStore.currentBoard?.owner.name }}&nbsp;/</span>
        </div>
        <div class="truncate text-lg -mt-1">{{ boardStore.currentBoard?.name }}</div>
      </div>
    </div>
    <nav class="flex sticky top-[5rem] z-20 px-4 h-[3rem] justify-between items-center bg-base-300 shadow-md">
      <div class="flex gap-4 h-full">
        <div ref="mobileNavContainer" class="flex gap-3 h-full overflow-x-hidden">
          <RouterLink :to="{ name: 'all-board' }" class="btn btn-ghost btn-sm pl-0 pr-2 h-full rounded-none opacity-75">
            <IconSVG iconName="arrow-left-short" :scale="1.25" />Board
          </RouterLink>
          <RouterLink :to="{ name: 'all-task' }" exact-active-class="border-b-2 border-b-primary hover:border-b-primary nav-selected"
            class="btn btn-ghost btn-sm px-1 h-full rounded-none">
            <IconSVG iconName="kanban" :scale="1.25" class="nav-icon" />
            <IconSVG iconName="kanban-fill" :scale="1.25" class="nav-icon-selected" />
            Task Table
          </RouterLink>
          <RouterLink :to="{ name: 'status-manage' }" ref="statusBtn" exact-active-class="border-b-2 border-b-primary hover:border-b-primary nav-selected"
            :class="{ 'invisible': intersectElements.includes(statusBtn?.$el) }"
            class="itbkk-manage-status btn btn-ghost btn-sm px-1 h-full rounded-none">
            <IconSVG iconName="tags" :scale="1.25" class="nav-icon" />
            <IconSVG iconName="tags-fill" :scale="1.25" class="nav-icon-selected" />
            Manage Status
          </RouterLink>
          <RouterLink :to="{ name: 'collab-manage' }" ref="collabBtn" exact-active-class="border-b-2 border-b-primary hover:border-b-primary nav-selected"
            :class="{ 'invisible': intersectElements.includes(collabBtn?.$el) }"
            class="itbkk-manage-collaborator btn btn-ghost btn-sm px-1 h-full rounded-none">
            <IconSVG iconName="people" :scale="1.25" class="nav-icon" />
            <IconSVG iconName="people-fill" :scale="1.25" class="nav-icon-selected" />
            Manage Collaborators
          </RouterLink>
        </div>
      </div>
      <div id="navbar-item-right">
        <BaseMenu v-show="intersectElements.length > 0" side="left" outline>
          <template #icon>
            <IconSVG iconName="three-dots" scale="1.25" />
          </template>
          <template #menu>
            <button v-show="intersectElements.includes(statusBtn?.$el)" @click="$router.push({ name: 'status-manage' })" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
              <IconSVG iconName="tags" :scale="1.25" />
              <span class="whitespace-nowrap">Manage Status</span>
            </button>
            <button v-show="intersectElements.includes(collabBtn?.$el)" @click="$router.push({ name: 'collab-manage' })" type="button" class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
              <IconSVG iconName="people" :scale="1.25" />
              <span class="whitespace-nowrap">Manage Collaborators</span>
            </button>
          </template>
        </BaseMenu>
      </div>
    </nav>
  </header>

  <header class="hidden sm:block sticky top-0 z-30">
    <div class="flex justify-between items-center bg-base-300 px-6 h-[5rem]">
      <div class="flex items-center gap-2">
        <ResponsiveLogo type="compact" />
        <div v-show="boardStore.currentBoard?.name" class="flex items-center gap-2">
          <div class="text-secondary">
            <IconSVG iconName="chevron-right" :scale="1" />
          </div>
          <!-- <div class="text-xl truncate max-w-[45vw]" :title="boardStore.currentBoard?.name">
            {{ boardStore.currentBoard?.name }}
          </div> -->
          <div class="max-w-[50vw]">
            <div class="opacity-60">
              <span class="truncate text-sm">{{ boardStore.currentBoard?.owner.name }}</span>
              <span> /</span>
            </div>
            <div class="truncate text-lg -mt-1">{{ boardStore.currentBoard?.name }}</div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <ThemeSwitch />
        <UserMenuButton @clickSignButton="handleSignButtonClick" />
      </div>
    </div>
  </header>
  <nav class="hidden sm:flex sticky top-[5rem] z-20 px-4 h-[3rem] justify-between items-center bg-base-300 shadow-md">
    <div class="flex gap-4">
      <div class="flex">
        <RouterLink :to="{ name: 'all-board' }" exact-active-class="bg-neutral opacity-100"
          class="btn btn-ghost btn-sm opacity-75">
          <IconSVG iconName="arrow-left-short" :scale="1.25" />Board
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'all-task' }" exact-active-class="bg-neutral opacity-100 nav-selected"
          class="btn btn-ghost btn-sm">
          <IconSVG iconName="kanban" :scale="1.25" class="nav-icon" />
          <IconSVG iconName="kanban-fill" :scale="1.25" class="nav-icon-selected" />
          Task Table
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'status-manage' }" exact-active-class="bg-neutral opacity-100 nav-selected"
          class="itbkk-manage-status btn btn-ghost btn-sm">
          <IconSVG iconName="tags" :scale="1.25" class="nav-icon" />
          <IconSVG iconName="tags-fill" :scale="1.25" class="nav-icon-selected" />
          Manage Status
        </RouterLink>
        <div class="divider divider-horizontal m-0"></div>
        <RouterLink :to="{ name: 'collab-manage' }" exact-active-class="bg-neutral opacity-100 nav-selected"
          class="itbkk-manage-collaborator btn btn-ghost btn-sm">
          <IconSVG iconName="people" :scale="1.25" class="nav-icon" />
          <IconSVG iconName="people-fill" :scale="1.25" class="nav-icon-selected" />
          Manage Collaborators
        </RouterLink>
      </div>
    </div>
    <div id="navbar-item-right"></div>
  </nav>
  <section class="flex flex-col sm:items-center max-w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-8rem)] h-auto">
    <slot></slot>
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

.nav-selected > .nav-icon {
  display: none;
}

.nav-selected > .nav-icon-selected {
  display: inline-grid;
}
</style>
