<script setup>
import { useThemeStore } from '@/stores/theme';
import BaseModal from './BaseModal.vue';
import SpiderWebbing from './festival/halloween/SpiderWebbing.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  clickBG: {
    type: Function,
    default: () => {}
  },
  width: {
    type: String,
    default: '40rem'
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
  <Transition>
    <BaseModal :show="show" @clickBG="clickBG" :mobileCenter="true">
      <div class="absolute bg-base-300 max-w-[90vw] rounded-xl h-auto flex flex-col" :style="{ width }">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-100 break-words flex-none flex justify-between">
          <slot name="title">Title</slot>
          <div v-if="themeStore.festivalThemeState && themeStore.festivalName === 'halloween'" class="grid place-items-center -translate-x-10 translate-y-5">
            <SpiderWebbing />
          </div>
        </div>
        <div class="flex gap-2 p-4 break-words" :class="contentFlow === 'column' ? 'flex-col' : 'flex-row'">
          <slot name="content">Content</slot>
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200 rounded-b-xl">
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
  </Transition>
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
</style>
