<script setup>
defineProps({
  side: {
    type: String,
    validator: (value) => ['left', 'right'].includes(value),
    default: 'right'
  },
  zLayer: {
    type: Number,
    default: 1
  },
  mode: {
    type: String,
    validator: (value) => ['button', 'icon'].includes(value),
    default: 'icon'
  },
  menuHeight: {
    type: String,
    default: 'auto'
  }
})
</script>

<template>
  <div class="dropdown itbkk-button-action" :class="{ 'dropdown-end': side === 'left' }">
    <div tabindex="0" @click="handleClick" role="button"
      :class="{ 'btn btn-sm btn-ghost btn-square': mode === 'icon' }">
      <slot :name="mode === 'button' ? mode : 'icon'"></slot>
    </div>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 gap-1 flex flex-col"
      :style="{ 'z-index': zLayer, height: menuHeight }">
      <slot name="menu"></slot>
    </ul>
  </div>
</template>

<style scoped></style>
