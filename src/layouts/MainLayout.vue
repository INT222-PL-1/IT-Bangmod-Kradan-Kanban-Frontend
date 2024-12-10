<script setup>
import MiniModal from '@/components/MiniModal.vue';
import { useMsalStore } from '@/stores/msal';
import { useUserStore } from '@/stores/user';
import { defineAsyncComponent, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router'

const HomeLayoutComponent = defineAsyncComponent(() => import(`@/layouts/HomeLayout.vue`))
const BoardLayoutComponent = defineAsyncComponent(() => import(`@/layouts/BoardLayout.vue`))

const router = useRouter()
const userStore = useUserStore()
const msalStore = useMsalStore()
const signOutModalOpenState = ref(false)

const handleSignOutConfirm = async () => {
  if (userStore.isMSAuthenticated) {
    await msalStore.signOutMS()
  } else {
    userStore.signOut()
  }
  signOutModalOpenState.value = false
}

const handleSignOutCancel = () => {
  signOutModalOpenState.value = false
}

const handleSignOutClick = async () => {
  signOutModalOpenState.value = true
}

const handleLoginClick = () => {
  router.push({ name: 'login' })
}
</script>

<template>

  <MiniModal
    :show="signOutModalOpenState"
  >
    <template #title>
      Sign Out
    </template>
    <template #content>
      Do you want to sign out? You will be redirected to the login page.
    </template>
    <template #actions>
      <button
      class="btn btn-neutral btn-sm"
      @click="handleSignOutCancel"
      >
        Cancel
      </button>
      <button
        class="btn btn-error btn-sm btn-outline"
        @click="handleSignOutConfirm"
      >
        Sign Out
      </button>
    </template>
  </MiniModal>

  <HomeLayoutComponent
    v-if="$route.meta.layout === 'Home'"
    @clickSignOut="handleSignOutClick"
    @clickLogin="handleLoginClick"
  >
    <RouterView />
  </HomeLayoutComponent>
  <BoardLayoutComponent
    v-else
    @clickSignOut="handleSignOutClick"
    @clickLogin="handleLoginClick"
  >
    <RouterView />
  </BoardLayoutComponent>
</template>