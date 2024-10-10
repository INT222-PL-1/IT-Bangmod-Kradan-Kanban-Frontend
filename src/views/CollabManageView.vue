<script setup>
import BaseTablePlate from '@/components/BaseTablePlate.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
import IconSVG from '@/components/IconSVG.vue'
import { useBoardStore } from '@/stores/board'
import { useUserStore } from '@/stores/user'
import { computed, onMounted } from 'vue'

const boardStore = useBoardStore()
const userStore = useUserStore()
const isBoardOwner = computed(() => boardStore.currentBoard?.owner.oid === userStore.user?.oid)

async function refreshBoardStatuses() {
  await boardStore.loadBoard()
}

onMounted(async () => {
  await refreshBoardStatuses()
})

const handleRefreshBtnClick = async () => {
  await refreshBoardStatuses()
}

// const boardModalData = ref({
//   name: `${userStore.user.name} personal board`
// })

</script>

<template>
  <section class="max-w-full pt-10 pb-20">
    <!-- <div class="text-md text-bold py-3">{{ boardModalData.name }} <span class="font-bold"> > Collaborator </span></div> -->
    <!-- <div class="text-2xl p-4 text-center">Collaborator Management</div> -->


    <BaseTablePlate>
      <template #right-menu>
        <ButtonWithIcon
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
                <button class="itbkk-button-remove btn btn-sm btn-error btn-outline min-w-35 max-w-35">Remove</button>
              </td>
              <td v-else class="min-w-60 max-w-60"></td>
            </tr>
          </tbody>
        </table>
      </template>
    </BaseTablePlate>
  </section>
</template>

<style scoped></style>
