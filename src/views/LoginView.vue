<script setup>
import IconSVG from '@/components/IconSVG.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { login } from '@/libs/userManagement'
import { useToastStore } from '@/stores/toast'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { query: { redirect } } = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const username = ref('')
const password = ref('')
const isPasswordShow = ref(false)
const isLoggingIn = ref(false)
const isLoginFailed = ref(false)

watch(username, (newValue) => {
    if (newValue.length >= 50) username.value = newValue.substring(0, 50)
})

watch(password, (newValue) => {
    if (newValue.length >= 14) password.value = newValue.substring(0, 14)
})

const handleTogglePasswordShow = () => {
    isPasswordShow.value = !isPasswordShow.value
}

const handleLoginSubmit = async () => {
    isLoggingIn.value = true
    isLoginFailed.value = false

    const res = await login(username.value, password.value)

    if (res.ok) {
        localStorage.setItem('itbkk_access_token', res.data.access_token)
        localStorage.setItem('itbkk_refresh_token', res.data.refresh_token)
        if (redirect) {
            router.push(redirect)
        } else {
            router.push({ name: 'all-board' })
        }
    } else {
        toastStore.createToast({
            status: 'error',
            title: 'Login Failed',
            description: 'Username or Password is incorrect'
        })
        isLoginFailed.value = true
    }
    isLoggingIn.value = false
}

</script>

<template>
    <div class="fixed top-4 right-4 z-40">
        <ThemeSwitch />
    </div>
    <main class="w-screen h-screen grid place-items-center">
        <div
            class="flex flex-col w-screen h-screen md:w-auto md:h-auto bg-base-200 rounded-xl px-14 py-14 animate-slide-in">
            <IconSVG iconName="itbkk-logo" :scale="4" size="4rem" />
            <span class="text-[2rem] mt-[1rem] mb-[0.5rem]">Login</span>
            <span class="opacity-80">Welcome to IT-Bangmod Kradan Kanban.</span>
            <span class="opacity-80">A productive and easy-to-manage task board.</span>
            <form @submit.prevent="handleLoginSubmit" class="flex flex-col mt-[0.5rem]">
                <span v-if="isLoginFailed" class="text-error">Invalid username or password.</span>
                <input v-model="username" type="text" placeholder="Username" :class="{ 'animate-shake-x-in border-error': isLoginFailed }"
                    class="itbkk-username input input-bordered border-2 bg-base-100 my-[1rem]"
                    :disabled="isLoggingIn"
                    />
                <div>
                    <input v-model="password" :type="isPasswordShow ? 'text' : 'password'"
                        placeholder="Password" :class="{ 'animate-shake-x-in border-error': isLoginFailed }"
                        class="itbkk-password input input-bordered border-2 w-full bg-base-100"
                        :disabled="isLoggingIn"
                        />
                    <button type="button" @click="handleTogglePasswordShow"
                        class="absolute -translate-x-full opacity-75">
                        <div v-show="!isPasswordShow">
                            <IconSVG iconName="eye" size="3rem" :scale="1.5" />
                        </div>
                        <div v-show="isPasswordShow">
                            <IconSVG iconName="eye-slash" size="3rem" :scale="1.5" />
                        </div>
                    </button>
                </div>
                <button type="submit" :disabled="username.length === 0 || password.length === 0"
                    :class="{ 'disabled': username.length === 0 || password.length === 0 }"
                    class="itbkk-button-signin mt-[2rem] btn btn-secondary py-[0.75rem] text-secondary-content text-base rounded-full disabled:cursor-not-allowed">Login</button>
                <div class="divider">Or</div>
                <button class="btn btn-neutral gap-3" disabled>
                    <IconSVG iconName="microsoft-logo" size="1.5rem" :scale="1.5" />
                    Login with Microsoft
                </button>
            </form>
        </div>
    </main> 
</template>

<style scoped>
</style>
