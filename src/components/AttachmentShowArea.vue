<script setup>
import { ref } from 'vue';
import AttachmentCard from './AttachmentCard.vue';
import IconSVG from './IconSVG.vue';

defineProps({
  existingFiles: {
    type: Array,
    required: true
  }
})

const fileAreaRef = ref(null)

const handleWheel = (e) => {
  e.preventDefault()
  fileAreaRef.value.scrollLeft += e.deltaY + e.deltaX
}

</script>

<template>
  <div class="relative" @wheel="handleWheel">
    <div ref="fileAreaRef" class="h-60 mt-2 bg-base-200 rounded-lg overflow-x-auto">
      <div v-if="existingFiles.length > 0" class="flex gap-4 h-full p-4 w-fit">
        <AttachmentCard
          v-for="file in existingFiles"
          :key="file.name"
          :file="file"
        />
      </div>
      <div v-else class="flex flex-col justify-center items-center h-full opacity-50">
        <IconSVG iconName="file-earmark" class="text-base-content" scale="3" size="3rem" />
        <div>No files attached</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
