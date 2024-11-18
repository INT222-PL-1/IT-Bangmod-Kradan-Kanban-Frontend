<script setup>
import IconSVG from '@/components/IconSVG.vue';
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { acceptInvitation, declineInvitation, getInvitation } from '@/libs/collaboratorManagement';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const invitation = ref(null)

async function loadCollaborator() {
  try {
    const res = await getInvitation(route.params.boardId, userStore.user.oid)
    invitation.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const handleAcceptInvitation = async () => {
  const res = await acceptInvitation(route.params.boardId, userStore.user.oid)
  if (res.ok) {
    toastStore.createToast({
      title: 'Accept invitation success',
      description: `You have joined the "${invitation.value.boardName}" board.`,
      status: 'success'
    })
    router.push({ name: 'all-task' })
  } else {
    toastStore.createToast({
      title: 'Accept invitation failed',
      description: `Failed to join the "${invitation.value.boardName}" board.`,
      status: 'error'
    })
  }
}

const handleDeclineInvitation = async () => {
  const res = await declineInvitation(route.params.boardId, userStore.user.oid)
  if (res.ok) {
    toastStore.createToast({
      title: 'Decline invitation success',
      description: `You have declined the invitation to join the "${invitation.value.boardName}" board.`,
      status: 'success'
    })
    router.push({ name: 'all-board' })
  } else {
    toastStore.createToast({
      title: 'Decline invitation failed',
      description: `Failed to decline the invitation to join the "${invitation.value.boardName}" board.`,
      status: 'error'
    })
  }
}

onMounted(async () => {
  await loadCollaborator()
})

</script>

<template>
  <div class="fixed top-4 right-4">
    <ThemeSwitch />
  </div>
  <div class="p-5 mx-auto mt-28 w-fit flex items-center gap-3">
    <IconSVG iconName="itbkk-logo" size="3rem" scale="3" />
    <div class="font-bold text-4xl">ITBKK</div>
  </div>
  <div v-if="invitation && invitation.inviteStatus && invitation.inviteStatus !== 'JOINED'" class="w-[25rem] bg-base-300 mx-auto rounded-lg flex flex-col items-center py-8">
    <IconSVG iconName="person-fill-add" size="4rem" scale="4" class="mt-8 mb-6" />
    <div class="flex flex-col items-center w-full gap-1">
      <!-- <div class="text-lg ">You've been invited to the</div>
      <div class="break-words max-w-[90%] text-lg "><span class="font-semibold">{{ invitation?.boardName }}</span> board.</div>
      <div class="text-sm my-3">Invited by {{ invitation?.ownerName }}</div> -->
      <div class="text-lg">
        <span class="font-bold">{{ invitation?.ownerName }}</span> has invited you
      </div>
      <div>to collaborate with {{ invitation?.accessRight }} access right on</div>
      <div class="text-lg font-bold">{{ invitation?.boardName }} board.</div>
    </div>
    <div class="flex gap-4 w-[90%] mt-14">
      <button @click="handleAcceptInvitation" class="flex-1 btn btn-success">Accept invitation</button>
      <button @click="handleDeclineInvitation" class="flex-1 btn btn-secondary">Decline</button>
    </div>
  </div>
  <div v-else class="w-[25rem] bg-base-300 mx-auto rounded-lg flex flex-col items-center py-8">
    <IconSVG iconName="person-fill" size="4rem" scale="4" class="mt-8 mb-6" />
    <div class="flex flex-col items-center w-full gap-1">
      <div class="text-lg">Invitation not found</div>
      <div class="text-sm my-3">Sorry, we couldn't find your active invitation to this board.</div>
      <RouterLink :to="{ name: 'all-board' }" class="btn btn-primary btn-link">Back to homepage</RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>