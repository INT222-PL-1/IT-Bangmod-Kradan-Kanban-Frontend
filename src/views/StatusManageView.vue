<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { deleteStatus, deleteStatusAndTransferTasks } from '@/libs/statusManagement'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/BaseModal.vue'
import StatusSelector from '@/components/StatusSelector.vue'
import BaseMenu from '@/components/BaseMenu.vue'
import { useBoardStore } from '@/stores/board'
import BaseTooltip from '@/components/BaseTooltip.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const boardStore = useBoardStore()
const userStore = useUserStore()

const isBoardOwner = computed(() => boardStore.currentBoard?.owner.oid === userStore.user?.oid)

const statusModalData = ref(null)
const statusDeleteModalOpenState = ref(false)
const statusTransferModalOpenState = ref(false)
const statusIdToTransfer = ref(1)

async function refreshBoardStatuses() {
  await boardStore.loadBoard()
}

onMounted(async () => {
  await refreshBoardStatuses()
})

const handleRefreshBtnClick = async () => {
  await refreshBoardStatuses()
}

const handleAddBtnClick = () => {
  router.push({ name: 'status-add' })
}

const handleEditBtnClick = (statusId) => {
  router.push({ name: 'status-edit', params: { statusId } })
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
  const { boardId } = route.params
  const res = await deleteStatusAndTransferTasks(fromStatusId, toStatusId, boardId)
  if (res.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\nPlease try again.`,
      status: 'error'
    })
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The tasks have been transferred and the status has been deleted.',
      status: 'success'
    })
    await boardStore.loadStatuses()
  }
  statusTransferModalOpenState.value = false
}

const handleDeleteStatus = async (statusId) => {
  const { boardId } = route.params
  const res = await deleteStatus(statusId, boardId)
  if (res.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === 401 ? 'Please try again.' : res.message}.`,
      status: 'error'
    })
    await boardStore.loadStatuses()
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'The status has been deleted',
      status: 'success'
    })
    await boardStore.loadStatuses()
  }
  statusDeleteModalOpenState.value = false
}

const handleTransferAndDeleteStatus = async (fromStatusId, toStatusId) => {
  await handleTransferStatus(fromStatusId, toStatusId)
}
</script>

<template>
  <Transition>
    <BaseModal @clickBG="statusDeleteModalOpenState = false" :show="statusDeleteModalOpenState" :mobileCenter="true">
      <div class="bg-base-300 w-[30rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-100 break-words flex-none">Delete a Status</div>
        <div class="itbkk-message p-4 break-words">
          Do you want to delete the <span class="opacity-75 italic">{{ statusModalData.name }}</span> status?
        </div>
        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
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
      <div class="bg-base-300 w-[30rem] max-w-[90vw] rounded-xl h-auto flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-100 break-words flex-none">Transfer a Status</div>
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
          class="flex justify-end items-center flex-none h-14 px-4 rounded-b-xl border-t-2 border-base-100 bg-base-200">
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

  <div class="max-w-full pt-10 pb-20">
    <div class="bg-base-300 rounded-lg shadow-md">
      <div class="px-4 min-h-8 sticky top-[8rem] z-10 py-3 border-b-base-200 border-b-2 bg-base-300 rounded-t-lg">
        <div class="flex justify-end py-2">
          <div class="flex gap-2">
            <BaseMenu side="left" class="md:hidden">
              <template #icon>
                <IconSVG iconName="three-dots" scale="1.25" />
              </template>
              <template #menu>
                <button @click="handleRefreshBtnClick" type="button"
                  class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                  <div :class="{ 'animate-spin': boardStore.isLoading.status }">
                    <IconSVG iconName="arrow-clockwise" :scale="1.25" />
                  </div>Refresh Statuses
                </button>
                <button v-if="isBoardOwner" @click="handleAddBtnClick" type="button"
                  class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
                  <IconSVG iconName="plus" :scale="1.25" />Add Status
                </button>
              </template>
            </BaseMenu>
            <button v-if="isBoardOwner" @click="handleAddBtnClick" type="button"
              class="itbkk-button-add btn btn-primary btn-sm text-neutral hidden md:flex">
              <IconSVG iconName="plus" :scale="1.25" />Add Status
            </button>
            <BaseTooltip text="Refresh Statuses">
              <button @click="handleRefreshBtnClick" type="button" class="btn btn-secondary btn-sm btn-square hidden md:flex">
                <div :class="{ 'animate-spin': boardStore.isLoading.status }">
                  <IconSVG iconName="arrow-clockwise" :scale="1.25" />
                </div>
              </button>
            </BaseTooltip>
          </div>
        </div>
      </div>
      <div class="table-overflow-x-scroll p-4">
        <table class="table table-zebra">
          <thead>
            <tr class="select-none">
              <th class="min-w-16 max-w-16"></th>
              <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">Name</th>
              <th class="min-w-96 max-w-96 sm:min-w-[35vw] sm:max-w-[35vw]">Description</th>
              <th class="min-w-16 max-w-16">Tasks</th>
              <th v-if="isBoardOwner" class="min-w-60 max-w-60">Action</th>
              <th v-else class="min-w-60 max-w-60"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="boardStore.isLoading.status && boardStore.statuses.length === 0">
              <td colspan="5" class="text-center">Loading statuses...</td>
            </tr>
            <tr v-else-if="boardStore.statuses === null">
              <td colspan="5" class="text-center">Error while loading statuses from server. Please try again later.</td>
            </tr>
            <tr v-else-if="boardStore.statuses.length === 0">
              <td colspan="5" class="text-center">No status</td>
            </tr>
            <tr v-else v-for="(status, index) in boardStore.statuses" :key="status.id" class="itbkk-item">
              <td class="min-w-16 max-w-16">
                <div class="grid place-items-center">
                  <div>{{ index + 1 }}</div>
                </div>
              </td>
              <td class="overflow-hidden min-w-52 max-w-52">
                <StatusBadge :statusData="status" textWrapMode="wrap"
                  class="itbkk-status-name cursor-default" width="100%" />
              </td>
              <td :class="{ 'italic text-[grey]': !status.description }"
                class="itbkk-status-description min-w-96 max-w-96 break-words">
                {{ status.description || 'No description is provided' }}
              </td>
              <td class="min-w-16 max-w-16 p-0">
                <div class="grid place-items-center">
                  <div
                    :class="{ 'text-error': status.count > boardStore.currentBoard?.taskLimitPerStatus && boardStore.currentBoard?.isTaskLimitEnabled && !status.isPredefined }"
                    class="flex items-center gap-1">
                    <IconSVG
                      v-show="status.count > boardStore.currentBoard?.taskLimitPerStatus && boardStore.currentBoard?.isTaskLimitEnabled && !status.isPredefined"
                      iconName="exclamation-diamond"
                      title="Task limit exceeded! Please transfer some tasks to other statuses or increase the limit." />
                    {{ status.count }}{{ boardStore.currentBoard?.isTaskLimitEnabled && !status.isPredefined ? '/' +
                      boardStore.currentBoard?.taskLimitPerStatus : ''
                    }}
                  </div>
                </div>
              </td>
              <td v-if="isBoardOwner">
                <div v-if="status.isPredefined === false" class="flex justify-center items-center gap-1 w-full">
                  <ButtonWithIcon @click="handleEditBtnClick(status.id)"
                    className="itbkk-button-edit btn btn-sm bg-base-300 hover:bg-base-100 justify-start flex flex-nowrap" iconName="pencil-square">
                    Edit
                  </ButtonWithIcon>
                  <ButtonWithIcon @click="handleOpenDeleteModal(status)"
                    className="itbkk-button-delete btn btn-sm bg-base-300 hover:bg-base-100 justify-start text-error flex flex-nowrap"
                    iconName="trash-fill">
                    Delete
                  </ButtonWithIcon>
                </div>
              </td>
              <td v-else></td>
            </tr>
          </tbody>
        </table>
        <div class="h-20"></div>
      </div>
    </div>
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
