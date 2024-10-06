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
  <div class="w-[70%] max-w-full pt-10">
    <!-- <div class="text-md text-bold py-3">{{ boardModalData.name }} <span class="font-bold"> > Collaborator </span></div> -->
    <!-- <div class="text-2xl p-4 text-center">Collaborator Management</div> -->


    <BaseTablePlate>
      <template #right-menu>
        <ButtonWithIcon
          className="btn btn-sm text-neutral bg-primary hover:bg-[#d14117] px-4 min-h-8 flex items-center justify-center itbkk-collaborative-add"
          iconName="person-plus">Add Collaborator
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
              <th v-if="isBoardOwner" class="min-w-60 max-w-60">Action</th>
              <th v-else class="min-w-60 max-w-60"></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="min-w-16 max-w-16 itbkk-item">
                <div class="grid place-items-center">
                  <div>1</div>
                </div>
              </td>

              <td class="min-w-16 max-w-16 justify-center">
                <div class="text-md font-bold"> Meow meow </div>
                <div class="text-sm text-gray-500 itbkk-email"> Meow@gmail.com </div>
              </td>

              <td class="min-w-18 max-w-18">
                <div class="dropdown itbkk-access-right">
                  <select class="transition flex bg-base-200 rounded-xl px-8 py-2 hover:contrast-75">
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <IconSVG iconName="chevron-down" size="1rem" />
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
  </div>
</template>

<style scoped></style>