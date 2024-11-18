<script setup>
import { useThemeStore } from '@/stores/theme';
import BaseModal from './BaseModal.vue';
import SpiderWebbing from './festival/halloween/SpiderWebbing.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  },
  clickBG: {
    type: Function,
    default: () => {}
  },
  width: {
    type: String,
    default: '65rem'
  },
  contentFlow: {
    type: String,
    default: 'column',
    validator: (value) => ['column', 'row'].includes(value)
  }
})

const themeStore = useThemeStore()

</script>

<template>
  <BaseModal :show="show" @clickBG="clickBG" :mobileCenter="false">
    <div :class="$props.class" class="bg-base-300 max-w-[100vw] sm:max-w-[90vw] sm:rounded-xl h-auto flex flex-col" :style="{ width }">
      <div class="text-2xl font-bold p-4 border-b-2 border-base-100 break-words flex-none flex justify-between">
        <div class="w-full">
          <slot name="title">Title</slot>
        </div>
        <div v-if="themeStore.festivalThemeState && themeStore.festivalName === 'halloween'" class="grid place-items-center -translate-x-10 translate-y-5">
          <SpiderWebbing />
        </div>
      </div>
      <div class="flex gap-2 p-4 break-words" :class="contentFlow === 'column' ? 'flex-col' : 'flex-row'">
        <slot name="content">Content</slot>
      </div>
      <div class="flex justify-end items-center flex-none h-[5rem] px-4 border-t-2 border-base-100 bg-base-200 rounded-b-xl">
        <div class="flex gap-2">
          <slot name="actions">
            <button class="itbkk-button-confirm btn btn-sm btn-success">
              Confirm
            </button>
            <button class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
          </slot>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped></style>
