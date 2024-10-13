<script setup>
import BaseModal from '@/components/BaseModal.vue'
import BaseTablePlate from '@/components/BaseTablePlate.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import IconSVG from '@/components/IconSVG.vue'
import { addCollaborator, removeCollaborator } from '@/libs/collaboratorManagement'
import { useBoardStore } from '@/stores/board'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const toastStore = useToastStore()
const boardStore = useBoardStore()
const userStore = useUserStore()
const isBoardOwner = computed(() => boardStore.currentBoard?.owner.oid === userStore.user?.oid)

const collaboratorModalData = ref({
  email: '',
  accessRight: 'READ'
})
const addCollaboratorModalOpenState = ref(false)
const disabledAddButton = computed(() => !collaboratorModalData.value.email)

const selectedCollaborator = ref(null)
const removeCollaboratorModalOpenState = ref(false)


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

const handleCollaboratorAddBtnClick = () => {
  console.log('Add Collaborator button clicked')
  addCollaboratorModalOpenState.value = true
}

const handleAddConfirm = async () => {
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
    addCollaboratorModalOpenState.value = false
    await refreshCollaborators()
  }
}

const handleAddCancel = () => {
  console.log('Cancel button clicked')
  addCollaboratorModalOpenState.value = false
}

const handleRemoveButtonClick = (collaborator) => {
  selectedCollaborator.value = collaborator
  removeCollaboratorModalOpenState.value = true
}

const handleRemoveConfirm = async () => {
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
    removeCollaboratorModalOpenState.value = false
    await refreshCollaborators()
  }
}

const handleRemoveCancel = () => {
  console.log('Remove Cancel button clicked')
  removeCollaboratorModalOpenState.value = false
}

</script>

<template>

  <Transition>
    <BaseModal
      :show="addCollaboratorModalOpenState" @clickBG="addCollaboratorModalOpenState = false" :mobileCenter="true">
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
            <button @click="handleAddConfirm" :class="{ disabled: disabledAddButton }" class="itbkk-button-ok btn btn-sm btn-success" :disabled="disabledAddButton">
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

  <Transition>
    <BaseModal
      :show="removeCollaboratorModalOpenState" @clickBG="removeCollaboratorModalOpenState = false" :mobileCenter="true">
      <div class="itbkk-modal-alert absolute bg-base-300 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
        <div class="text-2xl font-bold p-4 border-b-2 border-base-200 break-words flex-none">Remove Collaborator
        </div>
        <div class="flex p-4">
            <span>Do you want to remove <span class="italic">{{ selectedCollaborator?.name }}</span> from the board?</span>
        </div>

        <div class="flex justify-end items-center flex-none h-14 px-4 border-t-2 border-base-100 bg-base-200">
          <div class="flex gap-2">
            <button @click="handleRemoveConfirm" class="btn btn-sm btn-error btn-outline">
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

  <section class="max-w-full pt-10 pb-20">
    <!-- <div class="text-md text-bold py-3">{{ boardModalData.name }} <span class="font-bold"> > Collaborator </span></div> -->
    <!-- <div class="text-2xl p-4 text-center">Collaborator Management</div> -->


    <BaseTablePlate>
      <template #right-menu>
        <ButtonWithIcon
          @click="handleCollaboratorAddBtnClick"
          className="btn btn-sm btn-primary text-neutral itbkk-collaborative-add"
          iconName="person-plus">
          Add Collaborator
        </ButtonWithIcon>

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
              <th class="min-w-60 max-w-60">{{ isBoardOwner ? 'Action' : '' }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="boardStore.isLoading.collaborator">
              <td colspan="4" class="text-center h-32">Loading collaborators...</td>
            </tr>
            <tr v-else-if="boardStore.collaborators === null">
              <td colspan="4" class="text-center h-32">Error while loading collaborators from server. Please try again later.</td>
            </tr>
            <tr v-else-if="boardStore.collaborators.length === 0">
              <td colspan="4" class="text-center h-32">No collaborator</td>
            </tr>
            <tr v-else v-for="(collaborator, index) in boardStore.collaborators" :key="collaborator.oid">
              <td class="min-w-16 max-w-16 itbkk-item">
                <div class="grid place-items-center">
                  <div>{{ index + 1 }}</div>
                </div>
              </td>

              <td class="min-w-16 max-w-16 justify-center">
                <div class="text-md font-bold">{{ collaborator.name }}</div>
                <div class="text-sm text-gray-500 itbkk-email">{{ collaborator.email }}</div>
              </td>

              <td class="min-w-18 max-w-18">
                <div class="itbkk-access-right dropdown">
                  <select v-model="collaborator.accessRight" class="transition flex bg-base-200 rounded-xl px-8 py-2 hover:contrast-75">
                    <option value="READ">Read</option>
                    <option value="WRITE">Write</option>
                    <!-- <IconSVG iconName="chevron-down" size="1rem" /> -->
                  </select>
                </div>
              </td>

              <td v-if="isBoardOwner">
                <button @click="handleRemoveButtonClick(collaborator)" class="itbkk-button-remove btn btn-sm btn-error btn-outline min-w-35 max-w-35">Remove</button>
              </td>
              <td v-else class="min-w-35 max-w-35"></td>
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
