<script setup>
import { onMounted, ref } from 'vue';
import IconSVG from './IconSVG.vue';

const showBackToTopButton = ref(false);

const handleBtnClick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  const handleScroll = () => {
    showBackToTopButton.value = window.scrollY > 100;
  }
  window.addEventListener('scroll', handleScroll);
})

</script>

<template>
  <Transition>
    <button v-show="showBackToTopButton" @click="handleBtnClick"
      class="fixed bottom-[5vh] right-[3vw] btn btn-circle btn-secondary btn-md z-40">
      <IconSVG iconName="arrow-up" scale="1.5" />
    </button>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.3s;
  /* transform: rotate(0deg); */
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(200%)
}
</style>