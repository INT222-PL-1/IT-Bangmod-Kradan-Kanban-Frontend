<script setup>
import { ref } from 'vue'

const showMenu = ref(false)
const mousePosition = ref({ x: 0, y: 0 })

const handleClick = (e) => {
  showMenu.value = true
  mousePosition.value = { x: e.clientX, y: e.clientY }
}

</script>

<template>
  <div @click="handleClick" class="cursor-pointer">
    <slot name="icon"></slot>
  </div>
  <div @mouseleave="showMenu = false" :class="showMenu ? 'block' : 'hidden'" class="fixed z-10"
    :style="{ top: (mousePosition.y - 4) + 'px', left: (mousePosition.x - 4) + 'px' }">
    <slot name="menu"></slot>
  </div>
</template>

<style scoped></style>