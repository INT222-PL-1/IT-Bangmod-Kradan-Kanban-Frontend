<script setup>
import BaseMenu from './BaseMenu.vue';
import CopyButton from './CopyButton.vue';
import IconSVG from './IconSVG.vue';

defineEmits(['boardClick'])

const props = defineProps({
  board: {
    type: Object,
    required: true
  }
})

const boardUrl = window.location.href + `/${props.board.id}`

</script>

<template>
  <div class="group border-2 border-base-300 bg-base-200 rounded-md m-4 flex justify-between min-h-[7rem] max-w-[50rem] w-[90vw]">
    <div class="flex w-full">
      <div class="h-full w-2 transition-[width] bg-primary rounded-l-[0.25rem]" />
      <div class="flex justify-between w-full px-6 py-4">
        <div>
          <div class="flex gap-2">
            <IconSVG iconName="table" scale="1.25" size="2rem" />
            <div @click="$emit('boardClick', board.id)" class="font-semibold underline hover:text-primary underline-offset-4 cursor-pointer text-xl">{{ board.name }}</div>
          </div>
          <CopyButton :text="boardUrl" />
        </div>
        <BaseMenu side="left" mode="icon">
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
        </BaseMenu>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>