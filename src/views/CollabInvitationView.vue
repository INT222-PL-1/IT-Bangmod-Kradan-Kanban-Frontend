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
  <div v-if="invitation && invitation.inviteStatus && invitation.inviteStatus !== 'JOINED'" class="mt-28 w-[25rem] max-w-[90vw] bg-base-200 mx-auto rounded-lg flex flex-col items-center gap-6 p-6 border-2 border-base-300">
    <div class="inline-flex gap-2 items-center">
      <IconSVG iconName="itbkk-logo" size="3rem" scale="3" />
      <span class="font-bold text-4xl">ITBKK</span>
    </div>
    <div class="text-lg font-semibold flex gap-2 overflow-hidden whitespace-nowrap w-full">
      <div class="truncate">{{ invitation?.ownerName }}aaaaaaaaaaaaaaaaaaa</div>
      <div> has invited you</div>
    </div>
    <div class="bg-base-300 p-5 mask mask-circle">
      <IconSVG iconName="person-fill-add" size="4rem" scale="4" />
    </div>
    <div class="text-center w-full">
      <div>to collaborate with <span class="font-bold">{{ invitation?.accessRight }}</span> access right on</div>
      <div class="text-lg font-semibold truncate">{{ invitation?.boardName }} board.</div>
    </div>
    <div class="flex gap-4 w-full">
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