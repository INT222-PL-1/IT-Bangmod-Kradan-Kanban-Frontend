<script setup>
import { computed, onMounted, ref } from 'vue'

const isDebugMode = computed(() => {
  return import.meta.env.VITE_DEBUG === 'true'
})

const loadedData = ref([])

function loadLocalStorage() {
  const data = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key)
    data.push({ key, value })
  }
  loadedData.value = data
}

function saveLocalStorage() {
  loadedData.value.forEach(data => {
    localStorage.setItem(data.key, data.value)
  })
}

onMounted(() => {
  loadLocalStorage()
})
</script>

<template>
  <Teleport to="#debug">
    <div v-if="isDebugMode" class="fixed z-[100] bg-[#0000008b] w-[30rem]">
      <div>Debug UI</div>
      <div>
        <div>Local Storage</div>
        <ul>
          <li v-for="data in loadedData" :key="data.key">
            <strong>{{ data.key }}</strong>
            <textarea v-model="data.value" class="text-black w-full"></textarea>
          </li>
        </ul>
        <div class="flex gap-2">
          <button @click="loadLocalStorage" class="px-3 py-1 border">Refresh</button>
          <button @click="saveLocalStorage" class="px-3 py-1 border">Save</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

</style>