<script setup>
import { useStatusStore } from '@/stores/status';
import StatusBadge from './StatusBadge.vue';
import { computed, ref } from 'vue';
import IconSVG from './IconSVG.vue';

const props = defineProps({
  excludeStatusId: {
    type: Number,
    default: -1,
  },
})

const model = defineModel()
const searchTerm = ref('')
const statusStore = useStatusStore()

const statusList = computed(() => {
  const copiedStatuses = [...statusStore.statuses]
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
        <button class="active:scale-90 transition flex bg-base-200 rounded-xl p-2 hover:contrast-75">
          <StatusBadge class="cursor-pointer" :statusData="statusList.find(status => status.id === model)"
            textWrapMode="wrap" width="10rem" />
          <IconSVG iconName="chevron-down" size="2rem" />
        </button>
      </div>
      <div tabindex="0"
        class="dropdown-content menu p-2 mt-1 shadow bg-base-200 rounded-box w-72 gap-1 h-fit border border-base-300">
        <div class="flex items-center gap-2">
          <IconSVG iconName="search" size="2rem" />
          <input v-model="searchTerm" type="text" placeholder="Search status name"
            class="rounded-lg w-full bg-base-100 focus:outline-none focus:placeholder:opacity-50 p-2">
        </div>
        <div class="divider m-0"></div>
        <div v-show="filteredStatusList.length === 0" class="p-2 text-center">No status found</div>
        <div v-show="filteredStatusList.length > 0"
          class="grid grid-flow-row grid-cols-2 content-start gap-2 h-[4.5rem] sm:h-28 overflow-y-auto">
          <button v-for="status in filteredStatusList" :key="status.id"
            class="active:scale-90 transition p-0 bg-base-200 hover:contrast-75 w-fit rounded-lg">
            <StatusBadge class="cursor-pointer" @click="model = status.id" :statusData="status" textWrapMode="wrap" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
