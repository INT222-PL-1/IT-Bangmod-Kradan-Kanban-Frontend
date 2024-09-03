<script setup>
import BoardListItem from '@/components/BoardListItem.vue'
import IconSVG from '@/components/IconSVG.vue'
import ResponsiveLogo from '@/components/ResponsiveLogo.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import UserMenuButton from '@/components/UserMenuButton.vue'
import { useBoardStore } from '@/stores/board'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const boardStore = useBoardStore()
const userStore = useUserStore()

onMounted(() => {
  boardStore.loadAllBoards()
})

const handleAddBoardClick = () => {
  router.push({ name: 'board-add' })
}

const handleBoardClick = async (boardId) => {
  await boardStore.loadBoard(boardId)
  router.push({ name: 'all-task', params: { boardId } })
}

</script>

<template>
  <!-- <BoardAddModal @clickClose="handleAddBoardCancel" :show="boardAddModalOpenState" /> -->
  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <div class="h-[5rem] flex justify-between items-center px-6 bg-base-200 border-2 border-base-300 shadow-md">
    <ResponsiveLogo />
    <div class="flex items-center">
      <UserMenuButton />
      <ThemeSwitch />
    </div>
  </div>
  <div class="h-[5rem] mt-[2rem] flex justify-center items-center">
    <div class="text-3xl font-bold flex items-center gap-2">
      <IconSVG iconName="kanban" :scale="2" size="2rem" />
      <div>{{ userStore.user.name }}'s boards</div>
    </div>
  </div>
  <div class="h-[3rem] flex justify-end border-b-2 border-base-300">
    <button class="itbkk-button-create btn btn-primary btn-sm mr-6" @click="handleAddBoardClick">
      <IconSVG iconName="plus" scale="1.75" size="1rem" />
      Add New Board
    </button>
  </div>
  <div class="h-[calc(100vh-15rem)] w-[100vw] overflow-auto board-scrollbar pt-5 pb-32 flex flex-col items-center">
    <div v-if="boardStore.boards.length === 0" class="flex flex-col items-center justify-center h-full">
      <IconSVG iconName="inbox-empty" :scale="12" size="12rem" class="text-base-300" />
      <div>You have no board yet.</div>
      <div>Join other boards or <span @click="handleAddBoardClick" class="text-primary underline underline-offset-2 cursor-pointer">create a new one.</span></div>
    </div>
    <BoardListItem v-else v-for="board in boardStore.boards" :key="board" :board="board" @boardClick="handleBoardClick" />
  </div>
</template>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.board-scrollbar::-webkit-scrollbar {
  width: 10px;
  border-radius: 3px;
}

.board-scrollbar::-webkit-scrollbar-thumb {
  background-color: #ccced0;
  border-radius: 6px;
}

.board-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #707275;
}

</style>