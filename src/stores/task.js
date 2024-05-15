import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getTasks } from '@/libs/taskManagement'
import { superArraySorter } from '@/libs/utils'

export const useTaskStore = defineStore('task', () => {
  const rawTasks = ref([])
  const options = ref({
    defaultSortBy: 'id',
    sortBy: 'id',
    sortDirection: 'asc',
    filterByStatus: []
  })
  const tasks = computed(() => {
    const filteredTasks = options.value.filterByStatus.length < 1 ? [...rawTasks.value] : rawTasks.value.filter((task) => {
      return options.value.filterByStatus.includes(task.status.name)
    })
    const sortedTasks = superArraySorter(filteredTasks, options.value.sortBy, options.value.sortDirection)
    return sortedTasks
  })

  async function loadTasks() {
    rawTasks.value = await getTasks()
  }

  return { tasks, options, loadTasks }
})
