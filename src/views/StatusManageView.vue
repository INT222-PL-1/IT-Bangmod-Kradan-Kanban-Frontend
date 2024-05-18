<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useStatusStore } from '@/stores/status'
import IconSVG from '@/components/IconSVG.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { deleteStatus, transferTasksStatus, updateStatus } from '@/libs/statusManagement'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/BaseModal.vue'
import StatusSelector from '@/components/StatusSelector.vue'
import BaseMenu from '@/components/BaseMenu.vue'

const isLoading = ref(false)
const router = useRouter()
const statusStore = useStatusStore()
const toastStore = useToastStore()

const statusModalData = ref(null)
const statusDeleteModalOpenState = ref(false)
const statusTransferModalOpenState = ref(false)
const statusIdToTransfer = ref(1)
const statusSettingsModalOpenState = ref(false)

const currentStatusSettingsModalData = ref(null)
const disabledSaveSettingsBtn = computed(() => {
  return JSON.stringify(currentStatusSettingsModalData.value) === JSON.stringify(statusModalData.value)
})

async function fetchStatuses() {
  isLoading.value = true
  await statusStore.loadStatuses()
  isLoading.value = false
}

onMounted(async () => {
  await fetchStatuses()
})

const handleRefreshBtnClick = async () => {
  await fetchStatuses()
}

const handleAddBtnClick = () => {
  console.log('add button clicked')
  router.push({ name: 'status-add' })
}

const handleStatusClick = (statusId) => {
  console.log('status clicked', statusId)
}

const handleEditBtnClick = (statusId) => {
  router.push({ name: 'status-edit', params: { statusId } })
}

const handleSettingsBtnCLick = (statusData) => {
  statusModalData.value = statusData
  currentStatusSettingsModalData.value = { ...statusData }
  statusSettingsModalOpenState.value = true
}

const handleOpenTransferModal = (statusData) => {
  statusModalData.value = statusData
  statusTransferModalOpenState.value = true
}

const handleOpenDeleteModal = (statusData) => {
  if (statusData.count > 0) {
    handleOpenTransferModal(statusData)
  } else {
    statusModalData.value = statusData
    statusDeleteModalOpenState.value = true
  }
}

const handleTransferStatus = async (fromStatusId, toStatusId) => {
  const transferredStatus = await transferTasksStatus(fromStatusId, toStatusId)
  if (transferredStatus === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, please try again later.',
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The tasks have been transferred and the status has been deleted.',
      status: 'success'
    })
    await statusStore.loadStatuses()
  }
  statusTransferModalOpenState.value = false
}

const handleDeleteStatus = async (statusId) => {
  const deletedStatus = await deleteStatus(statusId)
  if (deletedStatus?.errorStatus === 404) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, the status does not exist',
      status: 'error'
    })
    await statusStore.loadStatuses()
  } else if (deletedStatus === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, please try again later',
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

const handleTransferAndDeleteStatus = async (fromStatusId, toStatusId) => {
  await handleTransferStatus(fromStatusId, toStatusId)
  // await handleDeleteStatus(fromStatusId)
}

const handleSaveSettingsStatus = async () => {
  const updatedStatus = await updateStatus(currentStatusSettingsModalData.value)
  if (updatedStatus === null) {
    toastStore.createToast({
      title: 'Error',
      description: 'An error has occurred, please try again later.',
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The status settings have been updated.',
      status: 'success'
    })
    await statusStore.loadStatuses()
  }
  statusSettingsModalOpenState.value = false
}

</script>

<template>

  <Transition>
    <BaseModal @clickBG="statusSettingsModalOpenState = false" :show="statusSettingsModalOpenState"
      :mobileCenter="true">
      <div class="bg-base-100 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Status Settings - {{
          statusModalData.name }}</div>
        <div class="flex flex-col gap-2 p-4 break-words">
          <div class="flex flex-col gap-2">
            <div class="flex-col">
              <div class="font-semibold text-lg underline">Limited Status</div>
              <div class="text-secondary text-sm">
                Users can limit the number of task in a status by setting the Maximum
                tasks in each status (except "No Status" and "Done" statuses).
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>Limit the number of tasks in this status</div>
              <input v-model="currentStatusSettingsModalData.is_limited_status" class="toggle" type="checkbox">
            </div>
            <div
              :class="{ 'opacity-50 cursor-not-allowed': currentStatusSettingsModalData.is_limited_status === false }"
              class="flex items-center justify-between">
              <div>Set number of tasks limit</div>
              <input v-model="currentStatusSettingsModalData.maximum_limit" class="input input-bordered input-sm w-16"
                type="number" min="0" max="9999"
                :disabled="currentStatusSettingsModalData.is_limited_status === false" />
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="handleSaveSettingsStatus" class="itbkk-button-confirm btn btn-sm btn-success"
              :disabled="disabledSaveSettingsBtn">
              Save
            </button>
            <button @click="statusSettingsModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

  <Transition>
    <BaseModal @clickBG="statusDeleteModalOpenState = false" :show="statusDeleteModalOpenState" :mobileCenter="true">
      <div class="bg-base-100 w-[30rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Delete a Status</div>
        <div class="itbkk-message p-4 break-words">
          Do you want to delete the <span class="opacity-75 italic">{{ statusModalData.name }}</span> status?
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="statusDeleteModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
            <button @click="handleDeleteStatus(statusModalData.id)"
              class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

  <Transition>
    <BaseModal @clickBG="statusTransferModalOpenState = false" :show="statusTransferModalOpenState"
      :mobileCenter="true">
      <div class="bg-base-100 w-[30rem] max-w-[90vw] rounded-xl h-auto flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Transfer a Status</div>
        <div class="itbkk-message p-4 break-words">
          <div>
            <div>There are <span class="font-semibold">{{ statusModalData.count }}</span> task{{
              statusModalData.count > 1 ? 's' : '' }} in <span class="opacity-75 italic">{{
                statusModalData.name }}</span> status.
            </div> In order to delete this status, the system must transfer
            task{{ statusModalData.count > 1 ? 's' : '' }} in this status to existing status.
            <div class="flex items-center gap-2 mt-4">
              Transfer tasks to
              <StatusSelector v-model="statusIdToTransfer" :excludeStatusId="statusModalData.id" />
            </div>
          </div>
        </div>
        <div
          class="flex justify-end items-center flex-none h-14 px-4 rounded-b-xl border-t-2 border-base-300 bg-base-200">
          <div class="flex gap-2">
            <button @click="statusTransferModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
            <button @click="handleTransferAndDeleteStatus(statusModalData.id, statusIdToTransfer)"
              class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
              Transfer and Delete
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

  <Teleport to="#navbar-item-left">
      <button @click="$router.push({ name: 'all-task'})" type="button"
        class="btn btn-outline btn-sm hidden sm:flex">
        <IconSVG iconName="house" :scale="1.25" />Home
      </button>

  </Teleport>

  <Teleport to="#navbar-item-right">
    <div class="flex gap-2">
      <BaseMenu side="left" class="sm:hidden">
        <template #icon>
          <IconSVG iconName="three-dots" />
        </template>
        <template #menu>
          <li>
            <button @click="handleRefreshBtnClick" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap">
              <div :class="{ 'animate-spin': isLoading }">
                <IconSVG iconName="arrow-clockwise" :scale="1.25" />
              </div>Refresh Statuses
            </button>
          </li>
        </template>
      </BaseMenu>
      <button @click="handleRefreshBtnClick" type="button" class="btn btn-secondary btn-sm hidden sm:flex">
        <div :class="{ 'animate-spin': isLoading }">
          <IconSVG iconName="arrow-clockwise" :scale="1.25" />
        </div>Refresh Statuses
      </button>
      <button @click="handleAddBtnClick" type="button" class="itbkk-button-add btn btn-primary btn-sm text-neutral">
        <IconSVG iconName="plus" :scale="1.25" />Add Status
      </button>
    </div>
  </Teleport>

  <div class="px-4 max-w-full table-overflow-x-scroll py-20">
    <!-- <div class="text-center p-2 text-xl font-semibold">Task Table</div> -->
    <table class="table border border-base-300">
      <thead class="bg-base-200">
        <tr>
          <th class="min-w-16 max-w-16"></th>
          <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">Name</th>
          <th class="min-w-96 max-w-96 sm:min-w-[35vw] sm:max-w-[35vw]">Description</th>
          <th class="min-w-16 max-w-16">Tasks</th>
          <th class="min-w-60 max-w-60">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading && statusStore.statuses.length === 0">
          <td colspan="5" class="text-center">Loading statuses...</td>
        </tr>
        <tr v-else-if="statusStore.statuses === null">
          <td colspan="5" class="text-center">Error while loading statuses from server. Please try again later.</td>
        </tr>
        <tr v-else-if="statusStore.statuses.length === 0">
          <td colspan="5" class="text-center">No status</td>
        </tr>
        <tr v-else v-for="(status, index) in statusStore.statuses" :key="status.id" class="itbkk-item">
          <td class="min-w-16 max-w-16">
            <div class="grid place-items-center">
              <div>{{ index + 1 }}</div>
            </div>
          </td>
          <td class="overflow-hidden min-w-52 max-w-52">
            <StatusBadge @click="handleStatusClick(status)" :statusData="status" textWrapMode="wrap"
              class="itbkk-status-name cursor-default" width="100%" />
          </td>
          <td :class="{ 'italic text-[grey]': !status.description }"
            class="itbkk-status-description min-w-96 max-w-96 break-words">
            {{ status.description || 'No description is provided' }}
          </td>
          <td class="min-w-16 max-w-16">
            <div class="grid place-items-center">
              <div>{{ status.count }}{{ status.is_limited_status ? '/' + status.maximum_limit : '' }}</div>
            </div>
          </td>
          <td class="min-w-44 max-w-44">
            <div v-if="status.is_fixed_status === false" class="flex justify-center items-center gap-1 w-full">
              <button @click="handleSettingsBtnCLick(status)" class="btn btn-square btn-sm">
                <IconSVG iconName="sliders2" />
              </button>
              <ButtonWithIcon @click="handleEditBtnClick(status.id)"
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
