<script setup>
import { captureVideoThumbnail, formatFileSize, getBootStrapIconFromMIME } from '@/libs/utils';
import { computed, onMounted, onUnmounted, ref } from 'vue'
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
  },
  uploadProgress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  }
})

const [iconName, iconColor] = getBootStrapIconFromMIME(props.file.type)
const cachedBlobUrls = ref([])

const fileSize = computed(() => {
  const size = props.file.size
  return formatFileSize(size)
})

function getBlobUrl(src) {
  const cachedBlobUrl = cachedBlobUrls.value.find((item) => item.src === src)
  if (cachedBlobUrl) return cachedBlobUrl.blobUrl

  let blobUrl = null

  if (src instanceof File) {
    blobUrl = URL.createObjectURL(src)
  } else {
    blobUrl = new Promise((resolve) => {
      zyos.fetch(src).then((res) => {
        try {
          resolve(URL.createObjectURL(res.data))
        } catch (error) {
          console.error(error)
          resolve(null)
        }
      })
    })
  }

  cachedBlobUrls.value.push({ src, blobUrl })
  return blobUrl
}

function downloadLocalFile() {
  const url = getBlobUrl(props.file)
  const a = document.createElement('a')
  a.href = url
  a.download = props.file.name
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function downloadServerFile() {
  const blobUrl = await getBlobUrl(props.file.url)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = props.file.url.split('/').at(-1)
  a.click()
  a.remove()
  URL.revokeObjectURL(blobUrl)
}

function previewLocalFile() {
  const url = getBlobUrl(props.file)
  window.open(url, '_blank')
  // URL.revokeObjectURL(url)
}

async function previewServerFile() {
  const blobUrl = await getBlobUrl(props.file.url)
  window.open(blobUrl, '_blank')
  // URL.revokeObjectURL(blobUrl)
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
      // TODO: Use thumbnail url from server instead of downloading the whole image
      image.value = await getBlobUrl(props.file.url)
    }
  }

  if (props.file.type.includes('video')) {
    if (props.file instanceof File) {
      image.value = await captureVideoThumbnail(props.file)
    } else {
      // TODO: Use thumbnail url from server instead of downloading the whole video
      const res = await zyos.fetch(props.file.url)
      image.value = await captureVideoThumbnail(res.data)
    }
  }
})

onUnmounted(() => {
  cachedBlobUrls.value.forEach((item) => URL.revokeObjectURL(item.blobUrl))

  if (image.value) {
    URL.revokeObjectURL(image.value)
  }
})

</script>

<template>
  <div class="flex-shrink-0 relative flex flex-col w-40 h-full bg-base-300 rounded-md" :title="file.name">
    <div v-if="mode === 'edit'" class="absolute top-1 right-1 z-10">
      <IconSVG iconName="x" class="text-base-content cursor-pointer" scale="1.5" @click="handleRemoveClick" />
    </div>
    <div class="h-[50%] bg-secondary rounded-t-md relative">
      <Transition name="fade">
        <div v-if="uploadProgress" class="absolute bg-[#0005] inset-0 grid place-items-center rounded-t-md z-20 opacity-80">
          <div class="radial-progress transition-transform duration-500" :style="`--value:${uploadProgress}`" role="progressbar">
            {{ Math.round(uploadProgress) }}%
          </div>
        </div>
      </Transition>
      <div class="h-full grid place-items-center">
        <div v-if="file.type.includes('video') && image" class="relative">
          <IconSVG iconName="camera-video-fill" className="absolute bottom-[-0.75rem] right-[-0.75rem] drop-shadow-[0px_0px_2px_#1d232a88]" scale="2" size="2rem" />
          <img v-if="image" :src="image" class="object-contain w-[6rem] h-[4rem] bg-black rounded-sm" />
        </div>
        <img v-else-if="file.type.includes('image') && image" :src="image" class="object-cover w-[4rem] h-[5rem] rounded-sm" />
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
      <div>
        <div v-if="file.type.includes('pdf') || file.type.includes('image') || file.type.includes('video') || file.type.includes('audio')" class="flex gap-1">
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
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
