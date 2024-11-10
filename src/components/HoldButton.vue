<script setup>
import { shakeElement } from '@/libs/utils';
import { computed, ref, useId } from 'vue';

const emits = defineEmits(['hold', 'release', 'holdFinish'])

const props = defineProps({
  color: {
    type: String,
    default: 'base',
    validator: (value) => {
      return ['base', 'primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
    }
  },
  duration: {
    type: Number,
    default: 3000
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const { value: { btnClass, bgClass }} = computed(() => {
  switch (props.color) {
    case 'primary':
      return { btnClass: 'btn-primary', bgClass: 'bg-primary' }
    case 'secondary':
      return { btnClass: 'btn-secondary', bgClass: 'bg-secondary' }
    case 'success':
      return { btnClass: 'btn-success', bgClass: 'bg-success' }
    case 'warning':
      return { btnClass: 'btn-warning', bgClass: 'bg-warning' }
    case 'error':
      return { btnClass: 'btn-error', bgClass: 'bg-error' }
    case 'info':
      return { btnClass: 'btn-info', bgClass: 'bg-info' }
    default:
      return { btnClass: '', bgClass: 'bg-base-content' }
  }
})

const holdDuration = ref(props.duration)
const bgWidth = ref('0%')
const buttonId = useId()
let holdTimeout = null

/**
 * @type {MouseEvent}
 */
let mouseOrTouchEvent = null

const reset = () => {
  bgWidth.value = '0%'
  holdDuration.value = 1000
  if (mouseOrTouchEvent instanceof TouchEvent) mouseOrTouchEvent.target.classList.add('btn-outline')
  clearTimeout(holdTimeout)
}

const shake = () => {
  const btn = document.getElementById(buttonId)
  shakeElement(btn)
}

const handleMouseDown = (e) => {
  mouseOrTouchEvent = e
  emits('hold')
  console.log('hold')
  if (e instanceof TouchEvent) e.target.classList.remove('btn-outline')
  bgWidth.value = '100%'
  holdDuration.value = props.duration
  holdTimeout = setTimeout(() => {
    emits('holdFinish')
    shake()
    reset()
  }, props.duration)
}

const handleCancel = () => {
  if (!mouseOrTouchEvent) return
  emits('release')
  console.log('release')
  bgWidth.value = '0%'
  reset()
}
</script>

<template>
  <button :id="buttonId" type="button" @touchstart.passive="handleMouseDown" @mousedown="handleMouseDown" @touchend="handleCancel" @mouseup="handleCancel" @mouseleave="handleCancel" :class="btnClass" class="group relative btn btn-sm btn-outline overflow-hidden flex justify-start p-0" :disabled="disabled">
    <div
      :class="[ bgClass && !disabled ? bgClass : 'bg-base-content' ]"
      class="progress-bg absolute bg-opacity-50 group-hover:bg-[#0002] h-full transition-[width] pointer-events-none"
      :style="{ width: bgWidth, transitionDuration: holdDuration + 'ms' }"  
    ></div>
    <div class="px-3 w-full h-full flex gap-2 justify-center place-items-center pointer-events-none z-10">
      <slot>Delay Button</slot>
    </div>
  </button>
</template>

<style scoped>
</style>
