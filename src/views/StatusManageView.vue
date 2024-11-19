<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import IconSVG from '@/components/IconSVG.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import { onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { deleteStatus, deleteStatusAndTransferTasks } from '@/libs/statusManagement'
import { useToastStore } from '@/stores/toast'
import StatusSelector from '@/components/StatusSelector.vue'
import { useBoardStore } from '@/stores/board'
import BaseTooltip from '@/components/BaseTooltip.vue'
import { useUserStore } from '@/stores/user'
import BaseTablePlate from '@/components/BaseTablePlate.vue'
import MiniModal from '@/components/MiniModal.vue'
import { HttpStatusCode } from 'zyos'
import DynamicTable from '@/components/DynamicTable.vue'

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
  await boardStore.loadCurrentBoard()
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
  if (boardStore.isLoading.action) return
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  const { boardId } = route.params

  try {
    boardStore.isLoading.action = true
    const res = await deleteStatusAndTransferTasks(fromStatusId, toStatusId, boardId)
    if (res.ok) {
      toastStore.createToast({
        title: 'Success',
        description: 'The tasks have been transferred and the status has been deleted.',
        status: 'success'
      })
      await boardStore.loadStatuses()
    } else {
      toastStore.createToast({
        title: 'Error',
        description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later.' : res.message}`,
        status: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    statusTransferModalOpenState.value = false
    boardStore.isLoading.action = false
  }
}

const handleDeleteStatus = async (statusId) => {
  if (boardStore.isLoading.action) return
  if (userStore.hasWriteAccessOnCurrentBoard === false) return
  const { boardId } = route.params

  try {
    boardStore.isLoading.action = true
    const res = await deleteStatus(statusId, boardId)
    if (res.ok) {
      toastStore.createToast({
        title: 'Success',
        description: 'The status has been deleted',
        status: 'success'
      })
      await boardStore.loadStatuses()
    } else {
      toastStore.createToast({
        title: 'Error',
        description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later.' : res.message}`,
        status: 'error'
      })
      await boardStore.loadStatuses()
    }
  } catch (error) {
    console.error(error)
  } finally {
    statusDeleteModalOpenState.value = false
    boardStore.isLoading.action = false
  }
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
        class="itbkk-button-confirm btn btn-sm btn-error btn-outline"
        :disabled="boardStore.isLoading.action"
      >
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
        class="itbkk-button-confirm btn btn-sm btn-error btn-outline"
        :disabled="boardStore.isLoading.action"
      >
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
        <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
          <button @click="handleAddBtnClick" type="button"
            class="itbkk-button-add btn btn-primary btn-sm text-neutral" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
            <IconSVG iconName="plus" :scale="1.25" />Add Status
          </button>
        </BaseTooltip>
        <BaseTooltip text="Refresh Statuses">
          <button @click="handleRefreshBtnClick" type="button"
            class="btn btn-secondary btn-sm btn-square">
            <IconSVG iconName="arrow-clockwise" :scale="1.25" :class="{ 'animate-spin': boardStore.isLoading.status }" />
          </button>
        </BaseTooltip>
      </template>
      <template #table>
        <DynamicTable
          tableClass="w-[80vw]"
          :colsCount="5"
          :colHeadersClass="['w-[5%]', 'w-[25%]', 'w-[30%]', 'w-[10%]', 'w-[20%]']"
          :colsClass="['w-[5%]', 'w-[25%]', 'w-[30%]', 'w-[10%]', 'w-[20%]']"
          :items="boardStore.statuses"
          itemsKey="id"
          :isLoading="boardStore.isLoading.status && boardStore.statuses.length === 0"
          :isError="boardStore.isError.status"
        >
          <template #col-header-1>
            <div class="flex items-center">#</div>
          </template>
          <template #col-header-2>
            <div class="flex items-center">Name</div>
          </template>
          <template #col-header-3>
            <div class="flex items-center">Description</div>
          </template>
          <template #col-header-4>
            <div class="flex w-full items-center justify-center">Tasks</div>
          </template>
          <template #col-header-5>
            <div class="flex items-center">Action</div>
          </template>
          <template #col-1="{ index }">
            <div class="flex items-center">{{ index + 1 }}</div>
          </template>
          <template #col-2="{ item }">
            <StatusBadge :statusData="item" textWrapMode="wrap" class="itbkk-status-name cursor-default" width="100%" />
          </template>
          <template #col-3="{ item }">
            <div :class="{ 'italic text-[grey]': !item.description }" class="itbkk-status-description break-words">
              {{ item.description || 'No description is provided' }}
            </div>
          </template>
          <template #col-4="{ item }">
            <div class="flex w-full items-center justify-center">
              <IconSVG
                v-show="item.count > boardStore.currentBoard?.taskLimitPerStatus && boardStore.currentBoard?.isTaskLimitEnabled && !item.isPredefined"
                iconName="exclamation-diamond"
                title="Task limit exceeded! Please transfer some tasks to other statuses or increase the limit."
              />
              {{ item.count }}{{ boardStore.currentBoard?.isTaskLimitEnabled && !item.isPredefined ? '/' + boardStore.currentBoard?.taskLimitPerStatus : '' }}
            </div>
          </template>
          <template #col-5="{ item }">
            <div v-if="item.isPredefined === false" class="flex justify-start items-center gap-2 w-full">
              <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
                <ButtonWithIcon @click="handleEditBtnClick(item.id)"
                  class="itbkk-button-edit btn btn-sm bg-base-300 hover:bg-base-100 justify-start flex flex-nowrap"
                  iconName="pencil-square" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
                  Edit
                </ButtonWithIcon>
              </BaseTooltip>
              <BaseTooltip text="You need to be board owner or has write access to perform this action." :disabled="userStore.hasWriteAccessOnCurrentBoard">
                <ButtonWithIcon @click="handleOpenDeleteModal(item)"
                  class="itbkk-button-delete btn btn-sm bg-base-300 hover:bg-base-100 justify-start text-error flex flex-nowrap"
                  iconName="trash-fill" :disabled="userStore.hasWriteAccessOnCurrentBoard === false">
                  Delete
                </ButtonWithIcon>
              </BaseTooltip>
            </div>
            <div v-else></div>
          </template>
          <template #loading>Loading statuses...</template>
          <template #error>Error while loading statuses from server. Please try again later.</template>
          <template #empty>No status</template>
        </DynamicTable>
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
