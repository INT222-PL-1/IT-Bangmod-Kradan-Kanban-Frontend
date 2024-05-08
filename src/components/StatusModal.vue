<script setup>
import BaseModal from '@/components/BaseModal.vue'

const handleCLickClose = () => {
  console.log('click bg')
}

</script>

<template>
  <BaseModal :show="true" @clickBG="handleCLickClose">
    <div
      class="bg-base-100 w-[65rem] max-w-full sm:max-w-[90vw] sm:rounded-xl h-auto lg:h-[40rem] overflow-hidden flex flex-col">

    </div>
  </BaseModal>
</template>

<style scoped></style>