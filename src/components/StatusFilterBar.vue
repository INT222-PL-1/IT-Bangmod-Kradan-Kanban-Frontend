<script setup>
import { computed, onMounted, ref } from 'vue'
import IconSVG from './IconSVG.vue'
import StatusBadge from './StatusBadge.vue'
import { useBoardStore } from '@/stores/board'
import NotificationIndicator from './NotificationIndicator.vue'

const boardStore = useBoardStore()
const searchTerm = ref('')

onMounted(async () => {
  await boardStore.loadStatuses()
})

const statusList = computed(() => {
  const copiedStatuses = [...boardStore.statuses]
  return copiedStatuses
})

const filteredStatusList = computed(() => {
  return statusList.value.filter(status => status.name.toLowerCase().includes(searchTerm.value.toLowerCase())).sort((a, b) => b.id - a.id)
})

const handleFilterClick = async () => {
  await boardStore.loadStatuses()
}

const handleStatusClick = (statusName) => {
  if (boardStore.options.filterStatuses.includes(statusName)) {
    boardStore.removeTaskFilterStatus(statusName)
  } else boardStore.addTaskFilterStatus(statusName)
}

const handleClearFilterButtonClick = () => {
  boardStore.clearTaskFilterStatus()
}

</script>

<template>
  <div @click="handleFilterClick" class="dropdown">
    <NotificationIndicator v-show="boardStore.options.filterStatuses.length > 0" type="warning" class="absolute top-[0.125rem] left-[0.125rem]" />
    <div class="flex items-center rounded-md overflow-hidden h-full bg-base-200">
      <div class="hover:bg-base-100 h-full">
        <button class="itbkk-status-filter active:scale-90" title="Choose Filter">
          <IconSVG iconName="filter" scale="1.25" size="2rem" />
        </button>
      </div>
      <div tabindex="0" role="button"
        class="flex gap-1 items-center py-1 px-2 w-36 sm:w-64 lg:w-96 h-full cursor-pointer border-x-2 border-base-100 bg-base-200">
        <div v-show="boardStore.options.filterStatuses.length === 0" class="text-sm font-semibold opacity-50">
          Filter By Status(es)
        </div>
        <div v-show="boardStore.options.filterStatuses.length > 0" class="flex flex-wrap gap-2">
          <div v-for="statusName of boardStore.options.filterStatuses" :key="statusName"
            @click="handleStatusClick(statusName)"
            class="hover:line-through hover:contrast-[0.90] transition-[filter] px-2 bg-base-100 rounded-lg flex-shrink-0 max-w-[7rem] truncate relative">
            {{ statusName }}
          </div>
        </div>
      </div>
      <div class="bg-base-200 hover:bg-base-100 h-full">
        <button @click="handleClearFilterButtonClick" class="active:scale-90" title="Clear Filter">
          <IconSVG iconName="x" scale="1.25" size="2rem" class="cursor-pointer" />
        </button>
      </div>
    </div>

    <div tabindex="0"
      class="dropdown-content menu mt-1 shadow bg-base-300 rounded-box w-[19rem] gap-1 h-fit border border-base-100 z-10">
      <div class="flex items-center gap-2">
        <IconSVG iconName="search" size="2rem" />
        <input v-model="searchTerm" type="text" placeholder="Search status name"
          class="rounded-lg w-full bg-base-100 focus:outline-none focus:placeholder:opacity-50 p-2">
      </div>
      <div class="divider m-0"></div>
      <div v-show="filteredStatusList.length === 0" class="p-2 text-center">No status found</div>
      <div v-show="filteredStatusList.length > 0"
        class="grid grid-flow-row grid-cols-2 content-start gap-2 h-[4.5rem] sm:h-28 overflow-y-auto overflow-x-hidden custom-scroll">
        <button v-for="status in filteredStatusList" :key="status.id" @click="handleStatusClick(status.name)"
          :class="{ 'opacity-25': !boardStore.options.filterStatuses.includes(status.name) }"
          class="active:scale-90 transition p-0 hover:contrast-75 w-fit rounded-lg">
          <StatusBadge class="itbkk-status-choice cursor-pointer" :statusData="status" textWrapMode="truncate"
            showCount />
        </button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  background-color: #f5f5f520;
  border-radius: 3px;
  width: 6px;
  height: 6px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #a2a2a2;
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #676767;
}
</style>
