<script setup>
import DynamicSVG from '@/components/DynamicSVG.vue'
import { onMounted, ref } from 'vue'

const ghostRandom = ref(0)

onMounted(() => {
  setInterval(() => {
    ghostRandom.value = Math.floor(Math.random() * 3)
  }, 10000)
})

</script>

<template>
  <div class="animate-ghost-haunt fixed bottom-0 right-0 -z-10 transition duration-500 opacity-30">
    <DynamicSVG v-show="ghostRandom === 0" svgName="ghost" />
    <DynamicSVG v-show="ghostRandom === 1" svgName="ghost-basket" />
    <DynamicSVG v-show="ghostRandom === 2" svgName="ghost-witch" />
  </div>
</template>

<style scoped>
.animate-ghost-haunt {
  animation: ghost-haunt 10s linear infinite;
}

@keyframes ghost-haunt {
  0% {
    transform: translate(512px, 0);
  }
  100% {
    transform: translate(-100vw, 0);
  }
}
</style>
