<script setup>
import { formatFileSize } from '@/libs/utils';
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
    <div class="absolute top-1 right-1">
      <IconSVG iconName="x" class="text-base-content cursor-pointer" scale="1.5" @click="handleRemoveClick" />
    </div>
    <div class="h-4/6 bg-secondary rounded-t-md">
      <div class="h-full grid place-items-center">
        <img v-if="file.type.includes('image')" :src="image" class="object-cover w-[5rem] h-[5rem] bg-white" />
        <IconSVG v-else-if="file.type.includes('pdf')" iconName="file-earmark-pdf" class="text-red-400" scale="3" size="3rem" />
        <IconSVG v-else-if="file.type.includes('word')" iconName="file-earmark-word" class="text-blue-400" scale="3" size="3rem" />
        <IconSVG v-else-if="file.type.includes('excel')" iconName="file-earmark-excel" class="text-green-400" scale="3" size="3rem" />
        <IconSVG v-else-if="file.type.includes('powerpoint')" iconName="file-earmark-ppt" class="text-orange-400" scale="3" size="3rem" />
        <IconSVG v-else-if="file.type.includes('zip')" iconName="file-earmark-zip" class="text-base-content" scale="3" size="3rem" />
        <IconSVG v-else-if="file.type.includes('audio')" iconName="file-earmark-music" class="text-base-content" scale="3" size="3rem" />
        <IconSVG v-else-if="file.type.includes('video')" iconName="file-earmark-play" class="text-base-content" scale="3" size="3rem" />
        <IconSVG v-else iconName="file-earmark" class="text-base-content" scale="3" size="3rem" />
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