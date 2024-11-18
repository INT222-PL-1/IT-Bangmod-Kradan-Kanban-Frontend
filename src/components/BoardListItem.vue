<script setup>
import Pl1AccessRight from '@/libs/enum/Pl1AccessRight';
import CopyButton from './CopyButton.vue';
import IconSVG from './IconSVG.vue';
import Pl1VisibilityType from '@/libs/enum/Pl1VisibilityType';
import { computed } from 'vue';

const emits = defineEmits(['boardClick', 'leaveBoardClick', 'acceptDeclineInviteClick'])

const props = defineProps({
  board: {
    type: Object,
    required: true
  }
})

const boardUrl = computed(() => `${window.location.href}/${props.board.id}`)
const isCollabBoard = computed(() => props.board.accessRight !== Pl1AccessRight.OWNER)
const isInvitePending = computed(() => props.board?.inviteStatus === 'PENDING')

const handleBoardLeaveClick = () => {
  emits('leaveBoardClick', props.board)
}

const handleBoardAcceptDeclineClick = () => {
  emits('acceptDeclineInviteClick', props.board)
}

const getBoardClass = (isCollabBoard, isInvitePending) => {
  return isCollabBoard && isInvitePending ? 'bg-gray-400' : 'bg-primary'
}

const getVisibilityIcon = (visibility) => {
  return visibility === Pl1VisibilityType.PRIVATE ? 'lock' : 'unlock'
}

</script>

<template>
  <div class="group bg-base-300 shadow-md rounded-md flex justify-between min-h-[7rem] max-w-[50rem] w-[90vw]">
    <div class="flex w-full">
      <div :class="getBoardClass(isCollabBoard, isInvitePending)" class="h-full min-w-1 sm:min-w-2 transition-[width] rounded-l-[0.25rem]" />
      <div class="flex flex-col sm:flex-row justify-between w-full pl-4 pr-6 py-4">
        <div class="flex flex-col justify-between">
          <div v-if="isCollabBoard && isInvitePending" class="text-xs">Invitation Pending</div>
          <div class="flex gap-2 items-center">
            <IconSVG iconName="table" scale="1.25" size="1.25rem" />
            <div v-if="isCollabBoard && isInvitePending" class="font-semibold underline-offset-4 text-lg sm:text-xl truncate max-w-[25rem]" :title="board.name">{{ board.name }}</div>
            <div v-else @click="$emit('boardClick', board.id)" class="font-semibold underline hover:text-primary underline-offset-4 cursor-pointer text-lg sm:text-xl truncate max-w-[25rem]" :title="board.name">{{ board.name }}</div>
            <div v-show="board.accessRight !== Pl1AccessRight.OWNER" class="bg-neutral px-2 rounded-md text-xs">{{ board.accessRight }}</div>
          </div>
          <div v-if="isCollabBoard && isInvitePending" class="my-2 text-xs opacity-60">{{ board.owner.name }} has invited you to collaborate with {{ board.accessRight }} access right on this board.</div>
          <div v-else class="hidden sm:flex gap-2 items-center">
            <CopyButton :text="boardUrl" label="Copy Link" />
          </div>
        </div>
        <div class="flex sm:flex-col sm:gap-4 items-end justify-between mt-2">
          <div class="flex sm:gap-[0.2rem] flex-col sm:items-end">
            <div class="flex gap-1 items-center">
              <IconSVG :iconName="getVisibilityIcon(board.visibility)" />
              {{ board.visibility }}
            </div>
            <div v-show="isCollabBoard" class="flex gap-1 items-center sm:text-sm">
              <IconSVG iconName="person" />
              <span class="opacity-50">{{ board.owner.name }}</span>
            </div>
          </div>
          <button v-if="isCollabBoard && isInvitePending" @click="handleBoardAcceptDeclineClick" class="btn btn-xs btn-outline">
            Accept / Decline
          </button>
          <button v-else-if="isCollabBoard" @click="handleBoardLeaveClick" class="btn btn-xs btn-outline btn-error">
            Leave
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
