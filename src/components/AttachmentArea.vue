<script setup>
import { useId } from 'vue';
import IconSVG from './IconSVG.vue';
import AttachmentCard from './AttachmentCard.vue';

const attachedfiles = defineModel()

const fileInputId = useId()

const handleFileChange = (e) => {
  const files = e.target.files
  if (files.length === 0) return
  attachedfiles.value = [...attachedfiles.value, ...files]
}

const handleRemoveClick = (file) => {
  attachedfiles.value = attachedfiles.value.filter(f => f !== file)
}

</script>

<template>
  <input :id="fileInputId" type="file" multiple @change="handleFileChange" class="hidden" />
  <div class="relative h-60 mt-2 py-4 bg-base-200 rounded-lg overflow-x-auto">
    <div v-show="attachedfiles.length === 0" class="absolute inset-0 m-4 rounded-md border-base-content border-[6px] border-dashed opacity-40 flex flex-col justify-center items-center">
      <IconSVG iconName="file-earmark" class="text-base-content m-1" scale="3" size="3rem" />
      <div class="text-2xl font-bold text-base-content">Drop files here</div>
      <label :for="fileInputId" class="text-base-content">or <span class="underline cursor-pointer">click to browse</span></label>
    </div>
    <div v-show="attachedfiles.length > 0" class="flex gap-4 h-full px-4 w-fit">
      <AttachmentCard v-for="file in attachedfiles" :key="file.name" :file="file" @removeClick="handleRemoveClick" />
    </div>
  </div>
</template>

<style scoped>

</style>