<script setup>
defineProps({
  side: {
    type: String,
    validator: (value) => ['left', 'right'].includes(value),
    default: 'right'
  }
})
</script>

<template>
  <div class="dropdown" :class="{ 'dropdown-end': side === 'left' }">
    <div tabindex="0" @click="handleClick" role="button" class="btn btn-sm btn-ghost">
      <slot name="icon"></slot>
    </div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 gap-1 flex flex-col">
      <slot name="menu"></slot>
    </ul>
  </div>
</template>

<style scoped></style>
