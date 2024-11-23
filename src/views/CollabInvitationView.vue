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

const isLoading = ref(false)
const invitation = ref(null)

async function loadCollaborator() {
  isLoading.value = true
  try {
    const res = await getInvitation(route.params.boardId, userStore.user.oid)
    invitation.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
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
  <div v-if="invitation && invitation.inviteStatus && invitation.inviteStatus !== 'JOINED'" class="mt-28 w-[30rem] max-w-[90vw] mx-auto">
    <div class="bg-base-200 rounded-t-lg flex flex-col items-center gap-6 p-6 border-2 border-b-0 border-base-300">
      <div class="inline-flex gap-2 items-center">
        <IconSVG iconName="itbkk-logo" size="3rem" scale="3" class="hidden sm:inline-grid" />
        <IconSVG iconName="itbkk-logo" size="2rem" scale="2" class="sm:hidden" />
        <span class="font-bold text-2xl sm:text-4xl">ITBKK</span>
      </div>
      <div class="sm:text-lg flex gap-1 justify-center overflow-hidden whitespace-nowrap w-full">
        <div class="truncate">{{ invitation?.ownerName }}</div>
        <div> has invited you</div>
      </div>
      <div class="bg-base-300 p-5 mask mask-circle">
        <IconSVG iconName="person-fill-add" size="4rem" scale="4" class="hidden sm:inline-grid" />
        <IconSVG iconName="person-fill-add" size="3rem" scale="3" class="sm:hidden" />
      </div>
      <div class="text-center w-full">
        <div class="text-sm sm:text-base">to collaborate with <span class="font-bold">{{ invitation?.accessRight }}</span> access right on</div>
        <div class="sm:text-lg font-bold truncate">"{{ invitation?.boardName }} board"</div>
      </div>
      <div class="divider my-0"></div>
      <div class="text-sm sm:text-base text-center w-full">
        <p>Do you want to accept the invitation as</p>
        <p><span class="font-bold">{{ userStore.user.name }}</span> ?</p>
      </div>
      <div class="flex gap-4 w-full">
        <button @click="handleDeclineInvitation" class="flex-1 btn btn-secondary">Decline</button>
        <button @click="handleAcceptInvitation" class="flex-1 btn btn-success">Accept invitation</button>
      </div>
      <div class="text-sm sm:text-base text-center w-full opacity-60">
        or <RouterLink :to="{ name: 'all-board' }" class="text-primary-500 underline">Back to homepage</RouterLink>
      </div>
    </div>
    <div class="text-xs sm:text-base grid place-items-center rounded-b-lg border-base-300 border-2 border-t-0 py-4">
      Copyright © 2024 - All right reserved by Dawnbreakers Team
    </div>
  </div>
  <div v-else-if="isLoading === false" class="mt-28 w-[25rem] max-w-[90vw] bg-base-200 mx-auto rounded-lg flex flex-col items-center gap-6 p-6 border-2 border-base-300">
    <div class="inline-flex gap-2 items-center">
      <IconSVG iconName="itbkk-logo" size="3rem" scale="3" />
      <span class="font-bold text-4xl">ITBKK</span>
    </div>
    <div class="text-lg font-semibold flex gap-2 justify-center overflow-hidden whitespace-nowrap w-full">
      Invitation not found
    </div>
    <div class="bg-base-300 p-5 mask mask-circle">
      <IconSVG iconName="question-lg" size="4rem" scale="4" />
    </div>
    <div class="text-center w-full">
      <div>Sorry, we couldn't find your active invitation to this board.</div>
    </div>
    <div class="flex flex-col items-center w-full gap-1">
      <RouterLink :to="{ name: 'all-board' }" class="btn btn-primary btn-link">Back to homepage</RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>