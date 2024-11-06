<script setup>
import { formatFileSize, getBootStrapIconFromMIME } from '@/libs/utils';
import { computed, onMounted, ref } from 'vue'
import IconSVG from './IconSVG.vue';

const emits = defineEmits(['removeClick'])
const image = ref(null)

const props = defineProps({
  file: {
    type: File,
    required: true
  }
})

const [iconName, iconColor] = getBootStrapIconFromMIME(props.file.type)

const fileSize = computed(() => {
  const size = props.file.size
  return formatFileSize(size)
})

const handleRemoveClick = () => {
  console.log('removeClick', props.file)
  emits('removeClick', props.file)
}

onMounted(() => {
  if (props.file.type.includes('image')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      image.value = e.target.result
    }
    reader.readAsDataURL(props.file)
  }
})

</script>

<template>
  <div class="flex-shrink-0 relative flex flex-col w-40 h-full bg-base-300 rounded-md" :title="file.name">
    <!-- {{ file.type }} -->
    <div class="absolute top-1 right-1">
      <IconSVG iconName="x" class="text-base-content cursor-pointer" scale="1.5" @click="handleRemoveClick" />
    </div>
    <div class="h-4/6 bg-secondary rounded-t-md">
      <div class="h-full grid place-items-center">
        <img v-if="file.type.includes('image')" :src="image" class="object-cover w-[5rem] h-[5rem] bg-white" />
        <IconSVG v-else :iconName="iconName" :class="iconColor" scale="3" size="3rem" />
      </div>
    </div>
    <div class="h-2/6 p-2 flex flex-col">
      <div class="truncate">{{ file.name }}</div>
      <div class="flex justify-between text-sm font-semibold opacity-50">
        <div>{{ file.name.split('.').at(-1).toUpperCase() }}</div>
        <div>{{ fileSize }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>