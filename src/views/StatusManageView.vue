<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useStatusStore } from '@/stores/status'
import IconSVG from '@/components/IconSVG.vue';
import ButtonWithIcon from '@/components/ButtonWithIcon.vue';
import { onMounted, ref } from 'vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { deleteStatus } from '@/libs/statusManagement';
import { useToastStore } from '@/stores/toast';
import BaseModal from '@/components/BaseModal.vue';

const isLoading = ref(false)
const router = useRouter()
const statusStore = useStatusStore()
const toastStore = useToastStore()

const statusDeleteModalData = ref(null)
const statusDeleteModalOpenState = ref(false)

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
  statusDeleteModalData.value = statusData
  statusDeleteModalOpenState.value = true
}

const handleDeleteStatus = async (statusId) => {
  const deletedStatus = await deleteStatus(statusId)
  if (deletedStatus?.errorStatus === 404) {
    deletedStatus.createToast({
      title: 'Error',
      description: 'An error has occurred, the status does not exist.',
      status: 'error'
    })
    await statusStore.loadTasks()
  } else if (deletedStatus === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, please try again later.',
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The status has been deleted',
      status: 'success'
    })
    await statusStore.loadStatuses()
  }
  statusDeleteModalOpenState.value = false
}

</script>

<template>

  <Transition>
    <BaseModal @clickBG="statusDeleteModalOpenState = false" :show="statusDeleteModalOpenState" :mobileCenter="true">
      <div class="bg-base-100 w-[30rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Delete a Status</div>
        <div class="itbkk-message p-4 break-words">
          Do you want to delete the <span class="opacity-75 italic">{{ statusDeleteModalData.name }}</span> status?
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="statusDeleteModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
            <button @click="handleDeleteStatus(statusDeleteModalData.id)"
              class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

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