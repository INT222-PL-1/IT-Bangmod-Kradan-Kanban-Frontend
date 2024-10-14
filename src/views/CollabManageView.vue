<script setup>
import BaseModal from '@/components/BaseModal.vue'
import BaseTablePlate from '@/components/BaseTablePlate.vue'
import BaseTooltip from '@/components/BaseTooltip.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import IconSVG from '@/components/IconSVG.vue'
import { addCollaborator, patchCollaborator, removeCollaborator } from '@/libs/collaboratorManagement'
import { useBoardStore } from '@/stores/board'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const toastStore = useToastStore()
const boardStore = useBoardStore()
const userStore = useUserStore()

const defaultCollaboratorModalData = {
  email: '',
  accessRight: 'READ'
}
const collaboratorModalData = ref(defaultCollaboratorModalData)
const addModalOpenState = ref(false)
const disabledAddButton = computed(() => !collaboratorModalData.value.email)

const selectedCollaborator = ref(null)
const removeModalOpenState = ref(false)
const changeAccessRightModalOpenState = ref(false)


async function refreshCollaborators() {
  await boardStore.loadCollaborators()
}

onMounted(async () => {
  if (boardStore.currentBoard === null) {
    await boardStore.loadBoard()
  } else {
    await refreshCollaborators()
  }
})

const handleRefreshBtnClick = async () => {
  await refreshCollaborators()
}

const handleAddButtonClick = () => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  console.log('Add Collaborator button clicked')
  collaboratorModalData.value = { ...defaultCollaboratorModalData }
  addModalOpenState.value = true
}

const handleAddConfirm = async () => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  const res = await addCollaborator(route.params.boardId, collaboratorModalData.value)
  if (res.status === 'error') {
    if (res.statusCode === 403) {
      toastStore.createToast({
        title: 'Error',
        description: 'You do not have permission to add collaborator to this board.',
        status: 'error'
      })
    } else if (res.statusCode === 404) {
      toastStore.createToast({
        title: 'Error',
        description: 'The user does not exists.',
        status: 'error'
      })
    } else if (res.statusCode === 409) {
      toastStore.createToast({
        title: 'Error',
        description: 'The user is already the collaborator of this board.',
        status: 'error'
      })
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'There is a problem. Please try again later.',
        status: 'error'
      })
    }
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'Collaborator added successfully.',
      status: 'success'
    })
    addModalOpenState.value = false
    await refreshCollaborators()
  }
}

const handleAddCancel = () => {
  console.log('Cancel button clicked')
  addModalOpenState.value = false
}

const handleRemoveButtonClick = (collaborator) => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  selectedCollaborator.value = collaborator
  removeModalOpenState.value = true
}

const handleRemoveConfirm = async () => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  console.log('Remove Confirm button clicked')
  const res = await removeCollaborator(route.params.boardId, selectedCollaborator.value.oid)
  if (res.status === 'error') {
    if (res.statusCode === 403) {
      toastStore.createToast({
        title: 'Error',
        description: 'You do not have permission to remove collaborator.',
        status: 'error'
      })
    } else if (res.statusCode === 404) {
      toastStore.createToast({
        title: 'Error',
        description: `${selectedCollaborator.value.name} is not a collaborator.`,
        status: 'error'
      })
      removeModalOpenState.value = false
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'There is a problem. Please try again later.',
        status: 'error'
      })
    }
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'Collaborator removed successfully.',
      status: 'success'
    })
    removeModalOpenState.value = false
    await refreshCollaborators()
  }
}

const handleRemoveCancel = () => {
  console.log('Remove Cancel button clicked')
  removeModalOpenState.value = false
}

const handleAccessRightChange = (collaborator) => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  selectedCollaborator.value = collaborator
  changeAccessRightModalOpenState.value = true
}

const handleAccessRightConfirm = async () => {
  if (userStore.isOwnerOfCurrentBoard === false) return

  console.log('Access Right Confirm button clicked')
  const res = await patchCollaborator(route.params.boardId, selectedCollaborator.value.oid, { accessRight: selectedCollaborator.value.accessRight })
  if (res.status === 'error') {
    if (res.statusCode === 403) {
      toastStore.createToast({
        title: 'Error',
        description: 'You do not have permission to change collaborator access right.',
        status: 'error'
      })
    } else if (res.statusCode === 404) {
      toastStore.createToast({
        title: 'Error',
        description: `${selectedCollaborator.value.name} is not a collaborator.`,
        status: 'error'
      })
      changeAccessRightModalOpenState.value = false
    } else {
      toastStore.createToast({
        title: 'Error',
        description: 'There is a problem. Please try again later.',
        status: 'error'
      })
    }
  } else {
    toastStore.createToast({
      title: 'Success',
      description: 'Access right changed successfully.',
      status: 'success'
    })
    changeAccessRightModalOpenState.value = false
    await refreshCollaborators()
  }
}

const handleAccessRightCancel = () => {
  console.log('Access Right Cancel button clicked')
  selectedCollaborator.value.accessRight = selectedCollaborator.value.accessRight === 'READ' ? 'WRITE' : 'READ'
  changeAccessRightModalOpenState.value = false
}

</script>

<template>

  <!-- ? Add Collaborator Modal -->
  <Transition>
    <BaseModal
      :show="addModalOpenState" @clickBG="addModalOpenState = false" :mobileCenter="true">
      <div class="itbkk-modal-alert absolute bg-base-300 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Add Collaborator
        </div>
        <div class="flex p-4">
          <div class="flex flex-col gap-2 flex-[2]">
            <span class="text-lg font-semibold">
              <span>Collaborator e-mail </span>
              <span class="text-error">* </span>
              <span class="text-sm">
                ({{ collaboratorModalData.email.length + '/50' }})
              </span>
            </span>
            <div>
              <div v-show="collaboratorModalData.email.length > 50"
                class="text-error text-xs">Email can not be more than 50
                characters</div>
              <div :class="{ 'border border-error animate-shake-x-in': collaboratorModalData.email.length > 50 }"
                class="bg-base-200 px-4 py-2 mt-2 rounded-lg">
                <input v-model.trim="collaboratorModalData.email" placeholder="Enter Collaborator E-mail (Required)"
                  class="itbkk-collaborator-email break-words w-full h-full outline-none focus:placeholder:opacity-50 bg-transparent resize-none" />
              </div>
            </div>
          </div>
          <div class="divider divider-horizontal"></div>
          <div class="flex flex-col gap-2 flex-[1]">
            <div>
              <span class="text-lg font-semibold">
                <span>Access Right</span>
              </span>
            </div>
            <div :class="{ 'border border-error animate-shake-x-in': false }"
              class="bg-base-200 mt-2 rounded-lg">
              <select v-model="collaboratorModalData.accessRight"
                class="itbkk-access-right select select-ghost select-sm w-full my-1">
                <option value="READ">Read</option>
                <option value="WRITE">Write</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
          <div class="flex gap-2">
            <button @click="handleAddConfirm" :class="{ disabled: disabledAddButton }" class="itbkk-button-confirm btn btn-sm btn-success" :disabled="disabledAddButton">
              Add
            </button>
            <button @click="handleAddCancel" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

  <!-- ? Remove Collaborator Modal -->
  <Transition>
    <BaseModal
      :show="removeModalOpenState" @clickBG="removeModalOpenState = false" :mobileCenter="true">
      <div class="itbkk-modal-alert absolute bg-base-300 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Remove Collaborator
        </div>
        <div class="flex p-4">
            <span>Do you want to remove <span class="italic">{{ selectedCollaborator?.name }}</span> from the board?</span>
        </div>

        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
          <div class="flex gap-2">
            <button @click="handleRemoveConfirm" class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
              Confirm
            </button>
            <button @click="handleRemoveCancel" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

  <!-- ? Change access right modal -->
  <Transition>
    <BaseModal
      :show="changeAccessRightModalOpenState" @clickBG="changeAccessRightModalOpenState = false" :mobileCenter="true">
      <div class="itbkk-modal-alert absolute bg-base-300 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Change Access Right</div>
        <div class="flex p-4">
            <span>Do you want to change access right of <span class="italic">{{ selectedCollaborator?.name }}</span> to <span class="font-semibold">{{ selectedCollaborator?.accessRight }}</span>?</span>
        </div>

        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
          <div class="flex gap-2">
            <button @click="handleAccessRightConfirm" class="itbkk-button-confirm btn btn-sm btn-error btn-outline">
              Confirm
            </button>
            <button @click="handleAccessRightCancel" class="itbkk-button-cancel btn btn-sm btn-neutral">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </Transition>

  <section class="max-w-full pt-10 pb-20">
    <!-- <div class="text-md text-bold py-3">{{ boardModalData.name }} <span class="font-bold"> > Collaborator </span></div> -->
    <!-- <div class="text-2xl p-4 text-center">Collaborator Management</div> -->


    <BaseTablePlate>
      <template #right-menu>
        <BaseTooltip text="You need to be board owner to perform this action." :disabled="userStore.isOwnerOfCurrentBoard">
          <ButtonWithIcon
            @click="handleAddButtonClick"
            className="itbkk-collaborator-add btn btn-sm btn-primary text-neutral"
            iconName="person-plus"  :disabled="userStore.isOwnerOfCurrentBoard === false">
            Add Collaborator
          </ButtonWithIcon>
        </BaseTooltip>

        <button @click="handleRefreshBtnClick" type="button"
          class="btn btn-sm btn-secondary justify-start flex flex-nowrap ">
          <div :class="{ 'animate-spin': boardStore.isLoading.status }">
            <IconSVG iconName="arrow-clockwise" :scale="1.25" />
          </div>
        </button>

      </template>
      <template #table>
        <table class="table table-zebra">

          <thead>
            <tr class="select-none">
              <th class="min-w-16 max-w-16"></th>
              <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">Members</th>
              <th class="min-w-96 max-w-96 sm:min-w-[20vw] sm:max-w-[30vw]">Access Right</th>
              <th class="min-w-60 max-w-60">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="boardStore.isLoading.collaborator && boardStore.isLoading.collaborator === 0">
              <td colspan="4" class="text-center h-32">Loading collaborators...</td>
            </tr>
            <tr v-else-if="boardStore.collaborators === null">
              <td colspan="4" class="text-center h-32">Error while loading collaborators from server. Please try again later.</td>
            </tr>
            <tr v-else-if="boardStore.collaborators.length === 0">
              <td colspan="4" class="text-center h-32">No collaborator</td>
            </tr>
            <tr v-else v-for="(collaborator, index) in boardStore.collaborators" :key="collaborator.oid" class="itbkk-item">
              <td class="min-w-16 max-w-16 itbkk-item">
                <div class="grid place-items-center">
                  <div>{{ index + 1 }}</div>
                </div>
              </td>

              <td class="min-w-16 max-w-16 justify-center">
                <div class="itbkk-name text-md font-bold">{{ collaborator.name }}</div>
                <div class="itbkk-email text-sm text-gray-500 itbkk-email">{{ collaborator.email }}</div>
              </td>

              <td class="min-w-18 max-w-18">
                <BaseTooltip text="You need to be board owner to perform this action." :disabled="userStore.isOwnerOfCurrentBoard">
                  <select @change="handleAccessRightChange(collaborator)" v-model="collaborator.accessRight" class="itbkk-access-right transition flex bg-base-100 select select-ghost select-sm"  :disabled="userStore.isOwnerOfCurrentBoard === false">
                    <option value="READ">Read</option>
                    <option value="WRITE">Write</option>
                    <!-- <IconSVG iconName="chevron-down" size="1rem" /> -->
                  </select>
                </BaseTooltip>
              </td>

              <td>
                <BaseTooltip text="You need to be board owner to perform this action." :disabled="userStore.isOwnerOfCurrentBoard">
                  <button @click="handleRemoveButtonClick(collaborator)" class="itbkk-collab-remove btn btn-sm btn-error btn-outline min-w-35 max-w-35"  :disabled="userStore.isOwnerOfCurrentBoard === false">Remove</button>
                </BaseTooltip>
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
