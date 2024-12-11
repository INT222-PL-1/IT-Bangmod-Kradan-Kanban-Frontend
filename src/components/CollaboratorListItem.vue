<script setup>

const emits = defineEmits(['changeAccessRight', 'clickRemoveCollab'])

defineProps({
  collaborator: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const accessRight = defineModel('accessRight', {
  type: String,
  default: false
})

const handleAccessRightChange = (collaborator) => {
  emits('changeAccessRight', collaborator)
}

const handleRemoveButtonClick = (collaborator) => {
  emits('clickRemoveCollab', collaborator)
}

</script>

<template>
  <div class="group bg-base-300 shadow-md rounded-md flex flex-col justify-between min-h-[7rem] w-full px-4 py-3">
    <div class="flex gap-2 text-sm">
      <div class="w-[5%]">{{ index + 1 }}</div>
      <div class="w-[95%] flex flex-col gap-1">
        <div
          :class="{ 'opacity-75': collaborator.inviteStatus === 'PENDING' }"
          class="itbkk-name text-sm font-bold flex"
        >
          <span class="flex-grow-0 truncate">{{ collaborator.name }}ssssss&nbsp;</span>
          <span class="flex-none text-sm font-normal">
            {{ collaborator.inviteStatus === 'PENDING' ? '(Pending invite)' : '' }}
          </span>
        </div>
        <div class="itbkk-email text-sm text-gray-500 itbkk-email">{{ collaborator.email }}</div>
      </div>
    </div>
    <div class="flex gap-3 justify-end">
      <select @change="handleAccessRightChange(collaborator)" v-model="accessRight" class="itbkk-access-right transition flex bg-base-100 select select-ghost select-sm"  :disabled="disabled || isLoading">
        <option value="READ">Read</option>
        <option value="WRITE">Write</option>
      </select>
      <button @click="handleRemoveButtonClick(collaborator)" class="itbkk-collab-remove btn btn-sm btn-outline min-w-35 max-w-35" :class="{ 'btn-error': collaborator.inviteStatus === 'JOINED' }"  :disabled="disabled || isLoading">
        {{ collaborator.inviteStatus === 'PENDING' ? 'Cancel' : 'Remove' }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>