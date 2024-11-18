<script setup>
import DynamicSVG from '@/components/DynamicSVG.vue';

defineProps({
  class: String
})
</script>

<template>
  <div class="absolute flex justify-center items-center w-28 h-28 rotate-12">
    <DynamicSVG svgName="web" class="scale-75" />
    <DynamicSVG svgName="spider" class="absolute" />
  </div>
</template>

<style scoped>

</style>
