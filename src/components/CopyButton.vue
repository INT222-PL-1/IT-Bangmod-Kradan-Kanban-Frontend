<script setup>
import { ref } from 'vue';
import IconSVG from './IconSVG.vue';
import { copyToClipboard } from '@/libs/utils';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 1.15
  },
  label: {
    type: String,
  },
  notifyText: {
    type: String,
    default: 'Copied to clipboard'
  }
})

const disabled = ref(window.isSecureContext === false)

const isCopied = ref(false)

const handleCopyBoard = async () => {
  await copyToClipboard(props.text)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="tooltip tooltip-secondary" :class="{ 'tooltip-open': isCopied }" :data-tip="notifyText">
    <button @click="handleCopyBoard" :class="{ 'btn-square': label.length === 0, 'btn-disabled': disabled }" class="btn btn-ghost btn-sm justify-start px-1" :disabled="disabled" :title="disabled ? 'Copy to clipboard is disabled in insecure context' : ''">
      <IconSVG iconName="link" :scale="size" :size="`${size}rem`" />
      <div class="text-sm font-thin">Copy Link</div>
    </button>
  </div>
</template>

<style scoped>
.tooltip:hover:not(.tooltip-open):before,
.tooltip:hover:not(.tooltip-open):after {
  opacity: 0;
}
</style>
