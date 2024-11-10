<script setup>
import { createStatus, getStatusById, updateStatus } from '@/libs/statusManagement';
import { useToastStore } from '@/stores/toast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import ColorPalette from './ColorPalette.vue'
import StatusBadge from './StatusBadge.vue';
import { colorValidator, errorArrayToString } from '@/libs/utils';
import IconSVG from './IconSVG.vue';
import { useBoardStore } from '@/stores/board';
import { HttpStatusCode } from 'zyos';
import BigModal from './BigModal.vue';

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const boardStore = useBoardStore()

const statusModalMode = ref('')
const statusModalData = ref(null)
let previousStatusData = null
const disabledSaveButton = computed(() => {
  return statusModalData.value.name.length < 1 ||
    statusModalData.value.name.length > 50 ||
    statusModalData.value.description.length > 200 ||
    colorValidator(statusModalData.value.color) === false ||
    (
      statusModalMode.value === 'edit' &&
      (
        statusModalData.value.name === previousStatusData.name &&
        statusModalData.value.description === previousStatusData.description &&
        statusModalData.value.color === previousStatusData.color
      )
    ) || boardStore.isLoading.microAction
})

async function loadSelectedStatusData() {
  const { statusId, boardId } = route.params
  const res = await getStatusById(statusId, boardId)
  if (res.ok) {
    statusModalData.value = res.data
    if (statusModalMode.value === 'edit') {
      previousStatusData = { ...statusModalData.value }
    }
  } else {
    toastStore.createToast({
      title: 'Error',
      description: `An error has occurred.\n${res.statusCode === HttpStatusCode.UNAUTHORIZED ? 'Please try again later.' : res.message}`,
      status: 'error'
    })
    router.replace({ name: 'status-manage' })
  }
}

onMounted(async () => {
  statusModalMode.value = route.name.split('-').pop()
  if (statusModalMode.value === 'add') {
    statusModalData.value = {
      name: '',
      description: '',
      color: '#A9A9A9',
    }
    return
  } else if (statusModalMode.value === 'edit') {
    await loadSelectedStatusData()
  } else {
    await loadSelectedStatusData()
  }
})

const handleClickClose = () => {
  router.replace({ name: 'status-manage' })
}

const handleClickConfirm = async () => {
  if (boardStore.isLoading.microAction) return
  const { boardId } = route.params

  try {
    boardStore.isLoading.microAction = true
    if (statusModalMode.value === 'add') {
      const res = await createStatus(statusModalData.value, boardId)
      if (res.ok) {
        const createdStatus = res.data
        toastStore.createToast({
          title: 'Success',
          description: `The status "${createdStatus.name}" is added successfully`,
          status: 'success'
        })
        router.push({ name: 'status-manage' })
      } else {
        toastStore.createToast({
          title: `Error while creating status`,
          description: `An error has occurred.\n${res.data?.errors ? 'Status ' + errorArrayToString(res.data.errors) : res.message}`,
          status: 'error'
        })
      }
      boardStore.loadStatuses()
    } else if (statusModalMode.value === 'edit') {
      const res = await updateStatus(statusModalData.value, boardId)
      if (res.ok) {
        const updatedStatus = res.data
        toastStore.createToast({
          title: 'Success',
          description: `The task "${updatedStatus.name}" is updated successfully`,
          status: 'success'
        })
        router.push({ name: 'status-manage' })
      } else {
        toastStore.createToast({
          title: 'Error while updating status',
          description: `An error has occurred.\n${res.data?.errors ? 'Status ' + errorArrayToString(res.data.errors) : res.message}`,
          status: 'error'
        })
      }
      boardStore.loadStatuses()
    }
  } catch (error) {
    console.error(error)
  } finally {
    boardStore.isLoading.microAction = false
  }
}

</script>

<template>
  <BigModal :show="statusModalData !== null" @clickBG="handleClickClose" className="itbkk-modal-status">
    <template #title>
      <span v-if="statusModalMode === 'add'">Add Status</span>
      <span v-else-if="statusModalMode === 'edit'">Edit Status</span>
    </template>
    <template #content>
      <div class="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-4 flex-auto">
        <div class="flex flex-col gap-2 flex-none">
          <div>
            <div>
              <span class="text-lg font-semibold flex-[0]">
                <span>Name </span>
                <span class="text-error">* </span>
                <span class="text-sm">
                  ({{ statusModalData.name.length + '/50' }})
                </span>
              </span>
              <span v-show="statusModalData.name.length > 50" class="text-error text-xs">Status name can not be more
                than
                50
                characters</span>
            </div>
            <div :class="{ 'border border-error animate-shake-x-in': statusModalData.name.length > 50 }"
              class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
              <textarea v-model.trim="statusModalData.name" placeholder="Enter Status Name (Required)"
                class="itbkk-status-name break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
            </div>
          </div>
          <div class="flex flex-col flex-auto">
            <div class="flex-none">
              <span class="text-lg font-semibold ">
                <span>Description</span>
                <span class="text-sm">
                  ({{ statusModalData.description.length + '/200' }})
                </span>
              </span>
              <span v-show="statusModalData.description.length > 200" class="text-error text-xs">
                Description can not be more than 200 characters
              </span>
            </div>
            <div :class="{
              'border border-error animate-shake-x-in': statusModalData.description?.length > 200,
              'italic text-[grey] grid place-items-center': !statusModalData?.description,
            }" class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-auto">
              <textarea v-model.trim="statusModalData.description" placeholder="Enter Task Description"
                class="itbkk-status-description break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none"></textarea>
            </div>
          </div>
          <div class="flex-none">
            <div>
              <span class="text-lg font-semibold flex-[0]">
                <span>Color </span>
              </span>
            </div>
            <div class="mt-2">
              <ColorPalette v-model="statusModalData.color" :colorList="[
                '#DC143C', '#ff5500', '#FFA500', '#80ff00', '#3CB371', '#40E0D0',
                '#20B2AA', '#1E90FF', '#9370DB', '#BA55D3', '#FF1493', '#A9A9A9'
              ]" />
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <div>
            <span class="text-lg font-semibold">
              <span>Preview</span>
            </span>
          </div>
          <div class="mt-2 md:flex-auto flex flex-col h-52 border-[3px] border-base-200 rounded-lg overflow-hidden">
            <div class="flex-auto grid place-items-center w-full bg-[#1f232a] relative">
              <div class="flex items-center gap-2 absolute top-2 left-3 text-sm text-[#ccced0]">
                <IconSVG iconName="moon-fill" />
                <div>Dark mode</div>
              </div>
              <StatusBadge :statusData="statusModalData" textWrapMode="wrap" width="20rem" />
            </div>
            <div class="flex-auto grid place-items-center w-full bg-[#ffffff] relative">
              <div class="flex items-center gap-2 absolute top-2 left-3 text-sm text-[#374151]">
                <IconSVG iconName="sun-fill" />
                <div>Light mode</div>
              </div>
              <StatusBadge :statusData="statusModalData" textWrapMode="wrap" width="20rem" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <button @click="handleClickConfirm"
        :class="{ 'btn-disabled disabled cursor-not-allowed': disabledSaveButton }"
        class="itbkk-button-confirm btn btn-success" :disabled="disabledSaveButton">
        Save
      </button>
      <button @click="handleClickClose" class="itbkk-button-cancel btn btn-neutral">
        Cancel
      </button>
    </template>
  </BigModal>
</template>

<style scoped></style>
