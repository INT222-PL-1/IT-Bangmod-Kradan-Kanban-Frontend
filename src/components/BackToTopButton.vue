<script setup>
// import { onMounted, ref, watch } from 'vue';
import IconSVG from './IconSVG.vue';

// const showBackToTopButton = ref(true);

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const handleBtnClick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// onMounted(() => {
//   const handleScroll = () => {
//     showBackToTopButton.value = window.scrollY > 100;
//   }

//   window.addEventListener('scroll', handleScroll);

//   return () => {
//     window.removeEventListener('scroll', handleScroll);
//   }

// })

</script>

<template>
  <button v-show="show" @click="handleBtnClick" class="fixed bottom-[5vh] right-[5vw] btn btn-circle btn-lg">
    <IconSVG iconName="arrow-up" scale="1.5" />
  </button>
</template>

<style scoped></style>