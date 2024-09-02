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
  <div class="bg-base-200">
    <div class="h-[5rem] flex justify-between items-center px-6">
      <ResponsiveLogo />
      <div class="flex items-center">
        <UserMenuButton />
        <ThemeSwitch />
      </div>
    </div>
    <div class="h-[7rem] flex justify-center items-end">
      <div class="text-3xl font-bold mb-10 flex items-center gap-2">
        <IconSVG iconName="kanban" :scale="2" size="2rem" />
        <div>{{ userStore.user.name }}'s boards</div>
      </div>
    </div>
    <div class="h-[3rem] flex justify-end">
      <button class="itbkk-button-create btn btn-primary btn-sm mr-6" @click="handleAddBoardClick">
        <IconSVG iconName="plus" scale="1.75" size="1rem" />
        Add New Board
      </button>
    </div>
  </div>
  <div class="h-[calc(100vh-15rem)] w-[100vw] overflow-auto border-t-2 border-base-300 board-scrollbar pt-10 pb-32 flex flex-col items-center">
    <BoardListItem v-for="board in boardStore.boards" :key="board" :board="board" @boardClick="handleBoardClick" />
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