<script setup>
import AttachmentCard from './AttachmentCard.vue';
import IconSVG from './IconSVG.vue';

defineProps({
  existingFiles: {
    type: Array,
    required: true
  }
})

</script>

<template>
  <div class="relative">
    <div class="h-60 mt-2 bg-base-200 rounded-lg overflow-x-auto">
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
