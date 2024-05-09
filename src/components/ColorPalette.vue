<script setup>
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  colorList: {
    type: Array,
    default: () => ['#000000', '#ffffff', '#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#1f2937', '#111827']
  },
})

const model = defineModel()

const formatedId = props.id ? props.id : Math.random().toString(36).substring(7)

</script>

<template>
  <input :id="formatedId" type="color" v-model="model" class="hidden">
  <div class="w-full h-52">
    <div class="w-24 h-24" :style="{ backgroundColor: model }"></div>
    <div class="grid grid-cols-5 gap-1 p-1 place-items-center">
      <div v-for="color in colorList" :key="color" @click="model = color" :style="{ backgroundColor: color }"
        class="rounded-md cursor-pointer w-[calc(100%/2)] h-8"></div>
      <label :for="formatedId" class="rounded-md cursor-pointer w-[calc(100%/2)] h-8 bg-secondary">P</label>
    </div>
  </div>
</template>

<style scoped></style>