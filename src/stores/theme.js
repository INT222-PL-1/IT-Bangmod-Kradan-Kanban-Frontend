import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {

  const festivalMonths = {
    10: 'halloween',
    // 12: 'christmas',
  }

  const festivalThemeState = ref(true)
  
  const isFestivalMonth = computed(() => {
    const month = new Date().getMonth() + 1
    return month in festivalMonths
  })

  const festivalName = computed(() => {
    const month = new Date().getMonth() + 1
    return festivalMonths[month]
  })

  function setFestivalThemeState(value) {
    festivalThemeState.value = value
  }

  return { festivalThemeState, isFestivalMonth, festivalName, setFestivalThemeState }
})
