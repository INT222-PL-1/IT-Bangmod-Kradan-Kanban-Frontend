<script setup>
import BoardListItem from '@/components/BoardListItem.vue'
import IconSVG from '@/components/IconSVG.vue'
import { useBoardStore } from '@/stores/board'
// import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const boardStore = useBoardStore()

// onMounted(async () => {
//   await boardStore.loadAllBoards()
// })

const handleAddBoardClick = () => {
  router.push({ name: 'board-add' })
}

const handleBoardClick = async (boardId) => {
  // await boardStore.loadBoard(boardId)
  router.push({ name: 'all-task', params: { boardId } })
}

</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <!-- <div class="h-[7rem] top-[5rem] sticky flex justify-center items-center bg-base-100 z-10">
    <div class="text-3xl font-bold flex items-center gap-2">
      <IconSVG iconName="kanban" :scale="2" size="2rem" />
      <div>{{ userStore.user.name }}'s boards</div>
    </div>
  </div> -->
  <section class="max-w-full pt-10 pb-20">
    <div class="flex justify-center">
      <div class="w-fit">
        <!-- <div class="h-[3rem] top-[12rem] sticky flex justify-end bg-base-100 z-10 border-b-2 border-base-300">
          <button class="itbkk-button-create btn btn-primary btn-sm mr-6" @click="handleAddBoardClick">
            <IconSVG iconName="plus" scale="1.75" size="1rem" />
            Add New Board
          </button>
        </div> -->

        <!--* Personal Boards -->
        <div class="h-[3rem] top-[5rem] sticky flex gap-2 items-center bg-base-100 z-10">
          <div class="flex-none flex gap-2 items-center text-2xl">
            <IconSVG iconName="person-fill" scale="1.5" size="1.5rem" />
            <div>Personal Boards</div>
          </div>
          <div class="flex-grow h-[2px] bg-base-content"></div>
          <!-- <button class="itbkk-button-create flex-none btn btn-primary btn-sm" @click="handleAddBoardClick">
            <IconSVG iconName="plus" scale="1.75" size="1rem" />
            Add New Board
          </button> -->
        </div>
        <div class="items-center pt-4 pb-16">
          <div v-if="boardStore.isLoading.board && boardStore.boards !== 0" class="flex items-center justify-center max-w-[50rem] w-[90vw]">
            <div class="loading loading-lg loading-dots" />
          </div>
          <div v-else class="flex flex-col gap-4">
            <div v-if="boardStore.boards.length === 0" class="flex flex-col items-center justify-center h-[25rem] max-w-[50rem] w-[90vw]">
              <IconSVG iconName="inbox-empty" :scale="12" size="12rem" class="text-base-300" />
              <div>You have no board yet.</div>
              <div>Join other boards or <span @click="handleAddBoardClick" class="text-primary underline underline-offset-2 cursor-pointer">create a new one.</span></div>
            </div>
            <BoardListItem v-else v-for="board in boardStore.boards" :key="board" :board="board" @boardClick="handleBoardClick" />
          </div>
        </div>

        <!--* Collaborative Boards -->
        <div class="h-[3rem] top-[5rem] sticky flex gap-3 items-center bg-base-100 z-10">
          <div class="flex-none flex gap-2 items-center text-2xl">
            <IconSVG iconName="people-fill" scale="1.5" size="1.5rem" />
            <div>Collaborative Boards</div>
          </div>
          <div class="flex-grow h-[2px] bg-base-content"></div>
        </div>
        <div class="items-center pt-4 pb-16">
          <div v-if="boardStore.isLoading.board && boardStore.boards !== 0" class="flex items-center justify-center max-w-[50rem] w-[90vw]">
            <div class="loading loading-lg loading-dots" />
          </div>
          <div v-else class="flex flex-col gap-4">
            <div v-if="boardStore.collaborativeBoards.length === 0" class="flex flex-col items-center justify-center h-[25rem] max-w-[50rem] w-[90vw]">
              <IconSVG iconName="inbox-empty" :scale="12" size="12rem" class="text-base-300" />
              <div>You have no collaborative board yet.</div>
              <div>Accept invitations and join other boards.</div>
            </div>
            <BoardListItem v-else v-for="board in boardStore.collaborativeBoards" :key="board" :board="board" @boardClick="handleBoardClick" />
            <!-- <BoardListItem v-else v-for="board in boardStore.boards" :key="board" :board="board" @boardClick="handleBoardClick" /> -->
          </div>
        </div>
        <!-- <div class="h-[100rem]"></div> -->
      </div>
    </div>
  </section>
  
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
