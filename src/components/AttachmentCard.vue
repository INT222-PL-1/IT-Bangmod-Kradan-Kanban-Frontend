<script setup>
import { formatFileSize, getBootStrapIconFromMIME } from '@/libs/utils';
import { computed, onMounted, ref } from 'vue'
import IconSVG from './IconSVG.vue';
import BaseTooltip from './BaseTooltip.vue';
import zyos from 'zyos';

const emits = defineEmits(['removeClick'])
const image = ref(null)

const props = defineProps({
  mode: {
    type: String,
    default: 'view',
    validator: (value) => ['view', 'edit'].includes(value)
  },
  file: {
    type: [File, Object],
    required: true
  }
})

const [iconName, iconColor] = getBootStrapIconFromMIME(props.file.type)

const fileSize = computed(() => {
  const size = props.file.size
  return formatFileSize(size)
})

async function getBlobUrl() {
  const url = props.file.url
  const res = await zyos.fetch(url)
  return URL.createObjectURL(res.data)
}

function downloadLocalFile() {
  const url = URL.createObjectURL(props.file)
  const a = document.createElement('a')
  a.href = url
  a.download = props.file.name
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function downloadServerFile() {
  const blobUrl = await getBlobUrl()
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = props.file.url.split('/').at(-1)
  a.click()
  a.remove()
  URL.revokeObjectURL(blobUrl)
}

function previewLocalFile() {
  const url = URL.createObjectURL(props.file)
  window.open(url, '_blank')
  URL.revokeObjectURL(url)
}

async function previewServerFile() {
  const blobUrl = await getBlobUrl()
  window.open(blobUrl, '_blank')
  URL.revokeObjectURL(blobUrl)
}

const handleRemoveClick = () => {
  console.log('removeClick', props.file)
  emits('removeClick', props.file)
}

const handleDownload = async () => {
  if (props.file instanceof File) {
    downloadLocalFile()
  } else {
    await downloadServerFile()
  }
}

const handlePreview = () => {
  if (props.file instanceof File) {
    previewLocalFile()
  } else {
    previewServerFile()
  }
}

onMounted(async () => {
  if (props.file.type.includes('image')) {
    if (props.file instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        image.value = e.target.result
      }
      reader.readAsDataURL(props.file)
    } else {
      image.value = await getBlobUrl()
    }
  }
})

</script>

<template>
  <div class="flex-shrink-0 relative flex flex-col w-40 h-full bg-base-300 rounded-md" :title="file.name">
    <div v-if="mode === 'edit'" class="absolute top-1 right-1">
      <IconSVG iconName="x" class="text-base-content cursor-pointer" scale="1.5" @click="handleRemoveClick" />
    </div>
    <div class="h-[50%] bg-secondary rounded-t-md">
      <div class="h-full grid place-items-center">
        <img v-if="image" :src="image" class="object-cover w-[5rem] h-[5rem] bg-white" />
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