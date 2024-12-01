<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import DebugUI from './components/debug/DebugUI.vue'

const DEBUG_MODE = import.meta.env.VITE_DEBUG === 'true'

</script>


<template>
  <DebugUI v-if="DEBUG_MODE" />
  <ToastContainer />
  <RouterView />
</template>
