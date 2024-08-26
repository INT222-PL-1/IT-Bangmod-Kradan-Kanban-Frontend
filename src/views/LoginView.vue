<script setup>
import IconSVG from '@/components/IconSVG.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { login } from '@/libs/userManagement'
import { useToastStore } from '@/stores/toast'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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

    const responseObject = await login(username.value, password.value)

    console.log(responseObject)

    if (responseObject.status === 'success') {
        localStorage.setItem('itbkk-token', responseObject.data.access_token)
        router.push({ name: 'all-task' })
    } else {
        toastStore.createToast({
            status: 'error',
            title: 'Login Failed',
            description: 'Username or Password is incorrect'
        })
    }

    isLoggingIn.value = false
    isLoginFailed.value = true
}

</script>

<template>
    <div class="fixed top-4 right-4 z-40">
        <ThemeSwitch />
    </div>
    <main class="fixed h-screen w-screen overflow-hidden">
        <div :class="{ '-translate-x-[100vw]': isLoggingIn }"
            class="w-[200vw] h-screen flex transition-transform duration-1000">
            <div class="w-screen h-screen grid place-items-center">
                <div
                    class="flex flex-col w-screen h-screen md:w-auto md:h-auto bg-base-200 rounded-xl px-14 py-14 animate-slide-in">
                    <IconSVG iconName="itbkk-logo" :scale="4" size="4rem" />
                    <span class="text-[2rem] mt-[1rem] mb-[0.5rem]">Login</span>
                    <span class="opacity-80">Welcome to IT-Bangmod Kradan Kanban.</span>
                    <span class="opacity-80">A productive and easy-to-manage task board.</span>
                    <form @submit.prevent="handleLoginSubmit" class="flex flex-col mt-[0.5rem]">
                        <span v-if="isLoginFailed" class="text-error">Invalid username or password.</span>
                        <input v-model="username" type="username" placeholder="Username"
                            :class="{ 'animate-shake-x-in border-error': isLoginFailed }"
                            class="itbkk-username input input-bordered border-2 bg-base-100 my-[1rem]" />
                        <div>
                            <input v-model="password" :type="isPasswordShow ? 'text' : 'password'"
                                placeholder="Password" :class="{ 'animate-shake-x-in border-error': isLoginFailed }"
                                class="itbkk-password input input-bordered border-2 w-full bg-base-100" />
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
                    </form>
                </div>
            </div>
            <div class="w-screen h-screen grid place-items-center">
                <div :class="{ 'opacity-100': isLoggingIn }"
                    class="opacity-0 transition-opacity delay-1000 duration-1000">
                    <div class="text-4xl font-semibold">We are logging you in</div>
                </div>
                <div :class="{ 'opacity-100': isLoggingIn }"
                    class="loading loading-lg loading-spinner transition opacity-0 delay-[2s] absolute translate-y-[200%]">
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
@media (width >=768px) {
    .animate-slide-in {
        animation: slide-in 1s ease;
    }
}

@keyframes slide-in {
    0% {
        transform: translateX(100vw) scale(0.5);
    }

    100% {
        transform: translateX(0vw) scale(1);
    }
}
</style>
