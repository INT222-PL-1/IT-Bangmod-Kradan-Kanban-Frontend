<script setup>
import Pl1AccessRight from '@/libs/enum/Pl1AccessRight';
// import BaseMenu from './BaseMenu.vue';
import CopyButton from './CopyButton.vue';
import IconSVG from './IconSVG.vue';
import Pl1VisibilityType from '@/libs/enum/Pl1VisibilityType';

const emits = defineEmits(['boardClick', 'leaveBoardClick'])

const props = defineProps({
  board: {
    type: Object,
    required: true
  }
})

const boardUrl = window.location.href + `/${props.board.id}`

const handleBoardLeaveClick = () => {
  emits('leaveBoardClick', props.board)
}

</script>

<template>
  <div class="group bg-base-300 shadow-md rounded-md flex justify-between min-h-[7rem] max-w-[50rem] w-[90vw]">
    <div class="flex w-full">
      <div class="h-full w-2 transition-[width] bg-primary rounded-l-[0.25rem]" />
      <div class="flex justify-between w-full px-6 py-4">
        <div class="flex flex-col justify-between">
          <div class="flex gap-2 items-baseline">
            <IconSVG iconName="table" scale="1.25" size="2rem" />
            <div @click="$emit('boardClick', board.id)" class="font-semibold underline hover:text-primary underline-offset-4 cursor-pointer text-xl truncate max-w-[25rem]" :title="board.name">{{ board.name }}</div>
            <div v-show="board.accessRight !== Pl1AccessRight.OWNER" class="bg-neutral px-2 rounded-md text-xs">{{ board.accessRight }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <CopyButton :text="boardUrl" label="Copy Link" />
          </div>
        </div>
        <div class="flex flex-col items-end justify-between">
          <!-- <div v-if="board.accessRight !== Pl1AccessRight.OWNER">{{ board.accessRight }}</div> -->
          <div class="flex gap-[0.2rem] flex-col items-end">
            <div class="flex gap-1 items-center">
              <IconSVG v-show="board.visibility === Pl1VisibilityType.PRIVATE" iconName="lock" scale="1" size="1rem" />
              <IconSVG v-show="board.visibility === Pl1VisibilityType.PUBLIC" iconName="unlock" scale="1" size="1rem" />
              {{ board.visibility }}
            </div>
            <div v-show="board.accessRight !== Pl1AccessRight.OWNER" class="flex gap-1 items-center text-sm">
              <IconSVG iconName="person" scale="1" size="1rem" />
              <span class="opacity-50">{{ board.owner.name }}</span>
            </div>
          </div>
          <button v-show="board.accessRight !== Pl1AccessRight.OWNER" @click="handleBoardLeaveClick" class="btn btn-xs btn-outline btn-error">
            Leave
          </button>
        </div>
        <!-- <BaseMenu side="left" mode="icon">
          <template #icon>
            <IconSVG iconName="three-dots" :scale="1.5" size="1.5rem" />
          </template>
          <template #menu>
            <button class="btn btn-ghost btn-sm w-full justify-start">
              <IconSVG iconName="pencil-square" size="1.5rem" />
              <div>Edit Board</div>
            </button>
            <button class="btn btn-ghost btn-sm w-full justify-start text-error">
              <IconSVG iconName="trash-fill" size="1.5rem" />
              <div>Delete Board</div>
            </button>
          </template>
        </BaseMenu> -->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
