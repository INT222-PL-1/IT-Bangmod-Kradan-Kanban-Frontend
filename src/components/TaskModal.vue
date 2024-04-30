<script setup>
import { getTimezone, formatDateTime } from '@/libs/utils'
import BaseModal from '@/components/BaseModal.vue'
import StatusBadge from './StatusBadge.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useTaskStore } from '@/stores/task';
import { getTaskById } from '@/libs/taskManagement';

defineEmits(['clickOk', 'clickClose'])

defineProps({
  show: {
    type: Boolean,
    default: false
  },
})

const route = useRoute()
const router = useRouter()
const toastStore = useTaskStore()
const taskModalData = ref({})

onMounted(async () => {
  const taskId = route.params.taskId
  taskModalData.value = await getTaskById(taskId)
  if (taskModalData.value === null) {
    toastStore.createToast({
      title: 'Error',
      description: `Task ${route.params.taskId} not found`,
      status: 'error'
    })
    router.push({ name: 'task' })
  }
})

const handleCLickClose = () => {
  router.replace({ name: 'task' })
}

</script>

<template>
  <BaseModal :show="show" @clickBG="handleCLickClose">
    <div
      class="bg-base-100 w-[65rem] max-w-full sm:max-w-[90vw] sm:rounded-xl h-auto lg:h-[40rem] overflow-hidden flex flex-col">
      <div class="itbkk-title text-2xl font-bold p-4 bg-base-200 break-words flex-none">
        {{ taskModalData?.title }}
      </div>
      <div class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 flex-auto">
        <div>
          <div class="p-4 w-full h-full flex flex-col">
            <div class="text-lg font-semibold flex-[0]">Description</div>
            <div :class="{
              'italic text-[grey] grid place-items-center': !taskModalData?.description,
            }" class="bg-base-200 px-4 py-2 mt-2 rounded-lg flex-[1]">
              <div class="itbkk-description break-words">
                {{ taskModalData?.description || 'No Description Provided' }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <div>
            <div class="p-4">
              <div class="text-lg font-semibold">Assignees</div>
              <div :class="{
                'italic text-[grey]': !taskModalData?.assignees,
              }" class="itbkk-assignees">
                {{ taskModalData?.assignees || 'Unassigned' }}
              </div>
            </div>
            <div class="p-4">
              <div class="text-lg font-semibold">Status</div>
              <div class="w-full max-w-[16rem]">
                <StatusBadge :status="taskModalData?.status" class="itbkk-status" />
              </div>
            </div>
          </div>
          <div>
            <div class="p-4 flex flex-col gap-1">
              <!-- <div class="text-lg font-bold">Timezone</div> -->
              <div class="flex">
                <div class="flex-[2] font-semibold">Timezone</div>
                <div class="itbkk-timezone flex-[3] text-sm bg-base-200 rounded-lg px-2">
                  {{ getTimezone() }}
                </div>
              </div>
              <div class="flex">
                <div class="flex-[2] font-semibold">Created On</div>
                <div class="itbkk-created-on flex-[3] text-sm bg-base-200 rounded-lg px-2">
                  {{ formatDateTime(taskModalData?.createdOn) }}
                </div>
              </div>
              <div class="flex">
                <div class="flex-[2] font-semibold">Updated On</div>
                <div class="itbkk-updated-on flex-[3] text-sm bg-base-200 rounded-lg px-2">
                  {{ formatDateTime(taskModalData?.updatedOn) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-2 p-4 flex-none">
        <button @click="$emit('clickOk')" class="itbkk-button btn btn-sm btn-success">
          Ok
        </button>
        <button @click="$emit('clickClose')" class="itbkk-button btn btn-sm btn-neutral">
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped></style>