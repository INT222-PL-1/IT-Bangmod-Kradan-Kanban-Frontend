<script setup>
import BaseMenu from './BaseMenu.vue';
import IconSVG from './IconSVG.vue';

defineEmits(['boardClick'])

defineProps({
  board: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="border-2 border-base-300 bg-base-200 rounded-md px-6 py-4 m-4 flex justify-between min-h-[7rem] max-w-[50rem] w-[90vw]">
    <div @click="$emit('boardClick', board.id)" class="font-semibold hover:underline underline-offset-4 cursor-pointer text-xl">{{ board.name }}</div>
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
</template>

<style scoped>

</style>