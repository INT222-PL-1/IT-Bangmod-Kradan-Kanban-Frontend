<script setup>
import { computed, ref } from 'vue';
import IconSVG from './IconSVG.vue';
import AttachmentCard from './AttachmentCard.vue';

const emits = defineEmits(['dropFiles'])

const props = defineProps({
  fileInputId: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const attachedFiles = defineModel('attached-files', {
  type: Array,
  default: []
})

const existingFiles = defineModel('existing-files', {
  type: Array,
  default: []
})

const showDropArea = ref(false)

const fileCount = computed(() => existingFiles.value.length + attachedFiles.value.length)

const handleRemoveClick = (file) => {
  if (file instanceof File) {
    attachedFiles.value = attachedFiles.value.filter(f => f !== file)
  } else {
    existingFiles.value = existingFiles.value.filter(f => f !== file)
  }
}

const handleDragEnter = (e) => {
  e.preventDefault()
  showDropArea.value = true
}

const handleDragEnd = (e) => {
  e.preventDefault()
  showDropArea.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  if (props.disabled) return
  showDropArea.value = false
  const files = e.dataTransfer.files
  if (files.length === 0) return
  // attachedFiles.value = [...attachedFiles.value, ...files]
  emits('dropFiles', files)
}

const handleClick = () => {
  if (props.disabled) return
  document.getElementById(props.fileInputId).click()
}

const handleDragOver = (e) => {
  e.preventDefault()
}

</script>

<template>
  <div class="relative">
    <div @dragenter="handleDragEnter" class="relative h-60 mt-2 bg-base-200 rounded-lg overflow-x-auto">
      <div v-show="fileCount > 0" class="flex gap-4 h-full p-4 w-fit">
        <AttachmentCard
          v-for="file in existingFiles"
          :key="file.name"
          :file="file"
          mode="edit"
          @removeClick="handleRemoveClick(file)"
        />
        <AttachmentCard
          v-for="file in attachedFiles"
          :key="file.name"
          :file="file"
          mode="edit"
          @removeClick="handleRemoveClick(file)"
        />
      </div>
    </div>
    <Transition>
      <div
        v-show="fileCount === 0 || showDropArea"
        @dragleave="handleDragEnd"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @click="handleClick"
        :class="{ 'bg-base-200 opacity-80': fileCount > 0 }"
        class="absolute inset-0 rounded-md p-4 opacity-50"
      >
        <div class="pointer-events-none relative w-full h-full rounded-md border-base-content border-[4px] border-dashed grid place-items-center">
          <div class="flex flex-col justify-center items-center">
            <IconSVG iconName="file-earmark" class="text-base-content m-1" scale="3" size="3rem" />
            <div class="text-2xl font-bold text-base-content">Drop files here</div>
            <div v-show="fileCount === 0" class="text-base-content">or <span class="underline">click to browse</span></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 100ms;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
