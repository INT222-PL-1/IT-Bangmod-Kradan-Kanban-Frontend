<script setup>
import { ref, watch } from 'vue';
import IconSVG from './IconSVG.vue';
import { colorValidator } from '@/libs/utils';

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

const errorMessage = ref('')
const formattedId = props.id ? props.id : Math.random().toString(36).substring(7)

watch(model, (value) => {
  if (colorValidator(value)) {
    errorMessage.value = ''
  } else {
    errorMessage.value = 'Invalid color format (supported only HEX color format. eg: #000000)'
  }
})

</script>

<template>
  <div class="w-full bg-base-200 p-4 rounded-lg flex flex-col gap-5">
    <div class="flex justify-between">
      <label :for="formattedId" class="w-24 h-24 rounded-lg grid place-items-center cursor-pointer"
        :style="{ backgroundColor: colorValidator(model) ? model : '#ffffff' }">
        <IconSVG iconName="eyedropper" scale="2.5" />
        <input :id="formattedId" type="color" v-model="model" class="w-0 h-0 opacity-0 absolute pointer-events-none">
      </label>
      <div class="grid grid-cols-6 gap-2 p-1 place-items-center">
        <div v-for="color in colorList" :key="color" @click="model = color" :style="{ backgroundColor: color }"
          class="rounded-md cursor-pointer w-10 h-10">
        </div>
      </div>
    </div>
    <div v-show="errorMessage !== ''" class="text-error text-sm">{{ errorMessage }}</div>
    <input type="text" :class="{ 'border border-error animate-shake-x-in': errorMessage !== '' }"
      class="text-center bg-base-100 p-2 rounded-lg w-full outline-none focus:placeholder:opacity-50"
      placeholder="Enter color in HEX format" v-model="model">
  </div>
</template>

<style scoped></style>