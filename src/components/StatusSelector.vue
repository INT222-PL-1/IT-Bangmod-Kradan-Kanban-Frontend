<script setup>
import StatusBadge from './StatusBadge.vue'
import { computed, onMounted, ref } from 'vue'
import IconSVG from './IconSVG.vue'
import { useBoardStore } from '@/stores/board'
import { useRoute } from 'vue-router'

const props = defineProps({
  excludeStatusId: {
    type: Number,
    default: -1,
  },
})

const route = useRoute()
const model = defineModel()
const searchTerm = ref('')
const boardStore = useBoardStore()

onMounted(async () => {
  await boardStore.loadStatuses(route.params.boardId)
})

const statusList = computed(() => {
  const copiedStatuses = [...boardStore.statuses]
  if (props.excludeStatusId !== -1) {
    copiedStatuses.splice(copiedStatuses.findIndex(status => status.id === props.excludeStatusId), 1)
  }
  return copiedStatuses
})
const filteredStatusList = computed(() => {
  return statusList.value.filter(status => status.name.toLowerCase().includes(searchTerm.value.toLowerCase())).sort((a, b) => b.id - a.id)
})

</script>

<template>
  <div class="z-[60]">
    <div class="dropdown itbkk-button-action">
      <div tabindex="0" @click="handleClick" role="button">
        <div class="active:scale-90 transition flex bg-base-200 rounded-xl p-2 hover:contrast-75">
          <div class="bg-base-100 rounded-lg">
            <StatusBadge class="cursor-pointer" :statusData="statusList.find(status => status.id === model)"
              textWrapMode="wrap" width="15rem" />
          </div>
          <IconSVG iconName="chevron-down" size="2rem" />
        </div>
      </div>
      <div tabindex="0"
        class="dropdown-content menu mt-1 shadow bg-base-300 rounded-box w-[19rem] gap-1 h-fit border border-base-100">
        <div class="flex items-center gap-2">
          <IconSVG iconName="search" size="2rem" />
          <input v-model="searchTerm" type="text" placeholder="Search status name"
            class="rounded-lg w-full bg-base-100 focus:outline-none focus:placeholder:opacity-50 p-2">
        </div>
        <div class="divider m-0"></div>
        <div v-show="filteredStatusList.length === 0" class="p-2 text-center">No status found</div>
        <div v-show="filteredStatusList.length > 0"
          class="grid grid-flow-row grid-cols-2 content-start gap-2 h-[4.5rem] sm:h-28 overflow-y-auto overflow-x-hidden custom-scroll">
          <button v-for="status in filteredStatusList" :key="status.id"
            class="active:scale-90 transition p-0 hover:contrast-75 w-fit rounded-lg">
            <StatusBadge class="cursor-pointer" @click="model = status.id" :statusData="status" textWrapMode="truncate"
              showCount :showLimit="boardStore.currentBoard?.isTaskLimitEnabled" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <select v-model="model" class="itbkk-status opacity-0 w-[1px] h-[1px]">
    <option v-for="status in statusList" :value="status?.id" :key="status?.id">
      {{ status?.name }}
    </option>
  </select>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  background-color: #f5f5f520;
  border-radius: 3px;
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #a2a2a2;
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #676767;
}
</style>
