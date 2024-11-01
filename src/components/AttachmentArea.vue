<script setup>
import IconSVG from './IconSVG.vue';


</script>

<template>
  <div class="relative h-60 mt-2 bg-base-200 rounded-lg">
    <div class="absolute m-4 inset-0 rounded-md border-base-content border-[6px] border-dashed opacity-40 flex flex-col justify-center items-center">
      <IconSVG iconName="file-earmark" class="text-base-content m-1" scale="3" size="3rem" />
      <div class="text-2xl font-bold text-base-content">Drop files here</div>
      <div class="text-base-content">or <span class="underline cursor-pointer">click to browse</span></div>
    </div>
  </div>
</template>

<style scoped>

</style>