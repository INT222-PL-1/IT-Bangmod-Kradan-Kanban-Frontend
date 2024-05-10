<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useStatusStore } from '@/stores/status'
import IconSVG from '@/components/IconSVG.vue';
import ButtonWithIcon from '@/components/ButtonWithIcon.vue';
import { onMounted, ref } from 'vue';
import StatusBadge from '@/components/StatusBadge.vue';

const isLoading = ref(false)
const router = useRouter()
const statusStore = useStatusStore()

async function fetchStatuses() {
  isLoading.value = true
  await statusStore.loadStatuses()
  isLoading.value = false
}

onMounted(async () => {
  await fetchStatuses()
})

const handleRefreshBtnCLick = async () => {
  await fetchStatuses()
}

const handleAddBtnCLick = () => {
  console.log('add button clicked')
  router.push({ name: 'status-add' })
}

const handleStatusClick = (statusId) => {
  console.log('status clicked', statusId)
}

const handleEditBtnCLick = (statusId) => {
  router.push({ name: 'status-edit', params: { statusId } })
}

const handleOpenDeleteModal = (statusData) => {
  console.log('delete button clicked', statusData)
}

</script>

<template>

  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <Teleport to="#navbar-item">
    <div class="flex gap-2">
      <button @click="handleRefreshBtnCLick" type="button" class="btn btn-secondary btn-sm">
        <div :class="{ 'animate-spin': isLoading }">
          <IconSVG iconName="arrow-clockwise" :scale="1.25" />
        </div>Refresh Statuses
      </button>
      <button @click="handleAddBtnCLick" type="button" class="itbkk-button-add btn btn-primary btn-sm text-neutral">
        <IconSVG iconName="plus" :scale="1.25" />Add Status
      </button>
    </div>
  </Teleport>

  <div class="px-4 w-11/12 my-5">
    <div class="text-base breadcrumbs">
      <ul>
        <li>
          <RouterLink :to="{ name: 'all-task' }"><span class="hover:underline cursor-pointer opacity-75">Home</span>
          </RouterLink>
        </li>
        <li class="font-semibold">Task Status</li>
      </ul>
    </div>
  </div>

  <div class="px-4 max-w-full table-overflow-x-scroll pb-20">
    <!-- <div class="text-center p-2 text-xl font-semibold">Task Table</div> -->
    <table class="table border border-base-300">
      <thead class="bg-base-200">
        <tr>
          <th class="min-w-16 max-w-16"></th>
          <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">Name</th>
          <th class="min-w-96 max-w-96 sm:min-w-[40vw] sm:max-w-[40vw]">Description</th>
          <th class="min-w-16 max-w-16">Tasks</th>
          <th class="min-w-44 max-w-44">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="statusStore.statuses === null">
          <td colspan="4" class="text-center">Error while loading statuses from server. Please try again later.</td>
        </tr>
        <tr v-else-if="statusStore.statuses.length === 0">
          <td colspan="4" class="text-center">No status</td>
        </tr>
        <tr v-else v-for="(status, index) in statusStore.statuses" :key="status.id" class="itbkk-item">
          <td class="min-w-16 max-w-16">
            <div class="grid place-items-center">
              <div>{{ index + 1 }}</div>
            </div>
          </td>
          <td class="overflow-hidden min-w-52 max-w-52">
            <!-- <div class="itbkk-status-name break-words font-semibold">
              {{ status.name }}
            </div> -->
            <StatusBadge @click="handleStatusClick(status.id)" :statusData="status" textWrapMode="wrap"
              class="itbkk-status-name cursor-default" width="100%" />
          </td>
          <td :class="{ 'italic text-[grey]': !status.description }"
            class="itbkk-status-description min-w-96 max-w-96 break-words">
            {{ status.description || 'No description provided' }}
          </td>
          <td class="min-w-16 max-w-16">
            <div class="grid place-items-center">
              <div>{{ status.count }}</div>
            </div>
          </td>
          <td class="min-w-44 max-w-44">
            <div class="flex justify-center items-center gap-2 w-full">
              <ButtonWithIcon @click="handleEditBtnCLick(status.id)"
                className="itbkk-button-edit btn btn-sm justify-start flex flex-nowrap" iconName="pencil-square">
                Edit
              </ButtonWithIcon>
              <ButtonWithIcon @click="handleOpenDeleteModal(status)"
                className="itbkk-button-delete btn btn-sm justify-start text-error flex flex-nowrap"
                iconName="trash-fill">
                Delete
              </ButtonWithIcon>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="h-24"></div> -->
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>