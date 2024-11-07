<script setup>
import { formatFileSize, getBootStrapIconFromMIME } from '@/libs/utils';
import { computed, onMounted, ref } from 'vue'
import IconSVG from './IconSVG.vue';
import BaseTooltip from './BaseTooltip.vue';

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

const handleDownload = () => {
  const url = URL.createObjectURL(props.file)
  const a = document.createElement('a')
  a.href = url
  a.download = props.file.name
  a.click()
  URL.revokeObjectURL(url)
}

const handlePreview = () => {
  const url = URL.createObjectURL(props.file)
  window.open(url, '_blank')
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
    <div class="h-[50%] bg-secondary rounded-t-md">
      <div class="h-full grid place-items-center">
        <img v-if="file.type.includes('image')" :src="image" class="object-cover w-[5rem] h-[5rem] bg-white" />
        <IconSVG v-else :iconName="iconName" :class="iconColor" scale="3" size="3rem" />
      </div>
    </div>
    <div class="h-[50%] p-2 flex flex-col justify-between">
      <div>
        <div class="truncate">{{ file.name }}</div>
        <div class="flex justify-between text-sm font-semibold opacity-50">
          <div>{{ file.name.split('.').at(-1).toUpperCase() }}</div>
          <div>{{ fileSize }}</div>
        </div>
      </div>
      <div v-if="file.type.includes('pdf') || file.type.includes('image')" class="flex gap-2">
        <BaseTooltip text="Download" className="flex-1">
          <button @click="handleDownload" class="w-full btn btn-sm btn-neutral">
            <IconSVG iconName="download" class="text-base-content" scale="1" />
          </button>
        </BaseTooltip>
        <BaseTooltip text="Open in new tab" className="flex-1">
          <button @click="handlePreview" class="w-full btn btn-sm btn-neutral">
            <IconSVG iconName="box-arrow-up-right" class="text-base-content" scale="1" />
          </button>
        </BaseTooltip>
      </div>
      <button v-else @click="handleDownload" class="w-full btn btn-sm btn-neutral">
        <IconSVG iconName="download" class="text-base-content" scale="1" />
        <div class="text-sm">Download</div>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>