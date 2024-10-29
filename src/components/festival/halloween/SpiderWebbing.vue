<script setup>
import DynamicSVG from '@/components/DynamicSVG.vue';

defineProps({
  className: String
})
</script>

<template>
  <div class="absolute flex justify-center items-center w-28 h-28 rotate-12">
    <DynamicSVG svgName="web" className="scale-75" />
    <DynamicSVG svgName="spider" className="absolute" />
  </div>
</template>

<style scoped>

</style>
