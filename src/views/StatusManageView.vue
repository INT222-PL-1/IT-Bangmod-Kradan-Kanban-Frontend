<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import { onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { deleteStatus, deleteStatusAndTransferTasks } from '@/libs/statusManagement'
import { useToastStore } from '@/stores/toast'
import StatusSelector from '@/components/StatusSelector.vue'
import BaseMenu from '@/components/BaseMenu.vue'
import { useBoardStore } from '@/stores/board'
import BaseTooltip from '@/components/BaseTooltip.vue'
import { useUserStore } from '@/stores/user'
import BaseTablePlate from '@/components/BaseTablePlate.vue'
import MiniModal from '@/components/MiniModal.vue'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const boardStore = useBoardStore()
const userStore = useUserStore()

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
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  router.push({ name: 'status-add' })
}

const handleEditBtnClick = (statusId) => {
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  router.push({ name: 'status-edit', params: { statusId } })
}

const handleOpenTransferModal = (statusData) => {
  statusModalData.value = statusData
  statusTransferModalOpenState.value = true
}

const handleOpenDeleteModal = (statusData) => {
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  if (statusData.count > 0) {
    handleOpenTransferModal(statusData)
  } else {
    statusModalData.value = statusData
    statusDeleteModalOpenState.value = true
  }
}

const handleTransferStatus = async (fromStatusId, toStatusId) => {
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  const { boardId } = route.params
  const res = await deleteStatusAndTransferTasks(fromStatusId, toStatusId, boardId)
  if (res.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === 401 ? 'Please try again later' : res.message}.`,
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
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  const { boardId } = route.params
  const res = await deleteStatus(statusId, boardId)
  if (res.status === 'error') {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === 401 ? 'Please try again later' : res.message}.`,
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
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  await handleTransferStatus(fromStatusId, toStatusId)
}
</script>

<template>
  <MiniModal @clickBG="statusDeleteModalOpenState = false" :show="statusDeleteModalOpenState" :mobileCenter="true">
    <template #title>Delete a Status</template>
    <template #content>
      <div class="itbkk-message break-words">
        Do you want to delete the <span class="opacity-75 italic">{{ statusModalData.name }}</span> status?
      </div>
    </template>
    <template #actions>
      <button @click="statusDeleteModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Cancel
      </button>
      <button @click="handleDeleteStatus(statusModalData.id)"
        class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
        Confirm
      </button>
    </template>
  </MiniModal>

  <MiniModal @clickBG="statusTransferModalOpenState = false" :show="statusTransferModalOpenState"
    :mobileCenter="true">
    <template #title>Transfer a Status</template>
    <template #content>
      <div class="itbkk-message break-words">
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
    </template>
    <template #actions>
      <button @click="statusTransferModalOpenState = false" class="itbkk-button-cancel btn btn-sm btn-neutral">
        Cancel
      </button>
      <button @click="handleTransferAndDeleteStatus(statusModalData.id, statusIdToTransfer)"
        class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
        Transfer and Delete
      </button>
    </template>
  </MiniModal>

  <RouterView v-slot="{ Component }">
    <Transition>
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <section class="max-w-full pt-10 pb-20">

    <!-- ? Desktop View -->
    <BaseTablePlate>
      <template #right-menu>
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
            <button v-if="userStore.hasWriteAccessOnCurrentBoard" @click="handleAddBtnClick" type="button"
              class="btn btn-sm btn-ghost justify-start flex flex-nowrap w-full">
              <IconSVG iconName="plus" :scale="1.25" />Add Status
            </button>
          </template>
        </BaseMenu>
        <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
          <button @click="handleAddBtnClick" type="button"
            class="itbkk-button-add btn btn-primary btn-sm text-neutral hidden md:flex" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
            <IconSVG iconName="plus" :scale="1.25" />Add Status
          </button>
        </BaseTooltip>
        <BaseTooltip text="Refresh Statuses">
          <button @click="handleRefreshBtnClick" type="button"
            class="btn btn-secondary btn-sm btn-square hidden md:flex">
            <div :class="{ 'animate-spin': boardStore.isLoading.status }">
              <IconSVG iconName="arrow-clockwise" :scale="1.25" />
            </div>
          </button>
        </BaseTooltip>
      </template>
      <template #table>
        <table class="table table-zebra">
          <thead>
            <tr class="select-none">
              <th class="min-w-16 max-w-16"></th>
              <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">Name</th>
              <th class="min-w-96 max-w-96 sm:min-w-[20vw] sm:max-w-[30vw]">Description</th>
              <th class="min-w-16 max-w-16">Tasks</th>
              <th class="min-w-60 max-w-60">Action</th>
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
                <StatusBadge :statusData="status" textWrapMode="wrap" class="itbkk-status-name cursor-default"
                  width="100%" />
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
              <td>
                <div v-if="status.isPredefined === false" class="flex justify-start items-center gap-2 w-full">
                  <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
                    <ButtonWithIcon @click="handleEditBtnClick(status.id)"
                    className="itbkk-button-edit btn btn-sm bg-base-300 hover:bg-base-100 justify-start flex flex-nowrap"
                    iconName="pencil-square" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
                    Edit
                    </ButtonWithIcon>
                  </BaseTooltip>
                  <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
                    <ButtonWithIcon @click="handleOpenDeleteModal(status)"
                      className="itbkk-button-delete btn btn-sm bg-base-300 hover:bg-base-100 justify-start text-error flex flex-nowrap"
                      iconName="trash-fill" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
                      Delete
                    </ButtonWithIcon>
                  </BaseTooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </BaseTablePlate>
  </section>
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
