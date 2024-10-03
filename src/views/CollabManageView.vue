<script setup>
// import CollaboratorButton from '@/components/CollaboratorButton.vue'
import BaseGround from '@/components/BaseGround.vue'
import ButtonWithIcon from '@/components/ButtonWithIcon.vue'
// import IconSVG from './IconSVG.vue'
</script>

<template>
  <div class="w-[90%] max-w-full">
    <p class="text-2xl p-4 text-center">Collaborator Management</p>
    <div class="bg-base-300 rounded-lg shadow-md flex justify-end">
      <div class="px-4 min-h-8 sticky z-10 py-3 border-b-base-200 border-b-2 bg-base-300 rounded-t-lg w-[15rem]">
        <ButtonWithIcon @click="0" className="btn btn-sm bg-base-300 hover:bg-base-100 flex justify-end flex-nowrap"
          iconName="person-plus">Add Collaborator
        </ButtonWithIcon>
      </div>
    </div>
  </div>
  <BaseGround>
    <template #content>
      <table class="table table-zebra">
        <thead>
          <th class="min-w-52 max-w-52 sm:min-w-[20vw] sm:max-w-[20vw]">No</th>
        </thead>
        <tbody>
          1
        </tbody>
      </table>
    </template>
  </BaseGround>
</template>

<style scoped></style>