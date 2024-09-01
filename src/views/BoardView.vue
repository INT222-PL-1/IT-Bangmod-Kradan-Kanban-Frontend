<script setup>
import BoardListItem from '@/components/BoardListItem.vue'
import IconSVG from '@/components/IconSVG.vue'
import ResponsiveLogo from '@/components/ResponsiveLogo.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import UserMenuButton from '@/components/UserMenuButton.vue'
import { useBoardStore } from '@/stores/board'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toastStore = useToastStore()
const boardStore = useBoardStore()
const userStore = useUserStore()

onMounted(() => {
  boardStore.loadAllBoards()
})

</script>

<template>
  <div class="h-[4rem] flex justify-between items-center px-4">
    <ResponsiveLogo />
    <div class="flex items-center">
      <UserMenuButton />
      <ThemeSwitch />
    </div>
  </div>
  <div class="h-[10rem] flex justify-center items-end">
    <div class="text-3xl font-bold mb-10 flex items-center gap-2">
      <IconSVG iconName="kanban" :scale="2" size="2rem" />
      <div>{{ userStore.user.name }}'s boards</div>
    </div>
  </div>
  <div class="max-w-full h-[calc(100vh-14rem)] flex justify-center">
    <div class="min-h-[20rem] max-w-[50rem] w-[90vw] bg-base-200 rounded-t-xl overflow-auto border-2 border-b-0 border-base-300 board-scrollbar">
      <BoardListItem v-for="board in boardStore.boards" :key="board" :board="board" />
    </div>
  </div>
</template>

<style scoped>
.board-scrollbar::-webkit-scrollbar {
  width: 6px;
  border-radius: 3px;
}

.board-scrollbar::-webkit-scrollbar-thumb {
  background-color: #ccced050;
  border-radius: 6px;
}

.board-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a3a5a8;
}

</style>