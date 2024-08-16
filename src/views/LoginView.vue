<script setup>
import IconSVG from '@/components/IconSVG.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue';
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const username = ref('')
const password = ref('')

watch(username, (newValue) => {
    if (newValue.length >= 50) username.value = newValue.substring(0, 50)
})

const handleLoginClick = () => {
    router.push({ name: 'all-task' })
}

</script>

<template>
    <div class="fixed top-4 right-4">
        <ThemeSwitch />
    </div>
    <main class="h-screen grid place-items-center">
        <div class="flex flex-col bg-base-200 rounded-xl px-14 py-14 shadow-[6px_6px_0px_3px_#0004]">
            <IconSVG iconName="itbkk-logo" :scale="4" size="4rem" />
            <span class="text-[2rem] mt-[1rem] mb-[0.5rem]">Login</span>
            <span>Welcome to IT-Bangmod Kradan Kanban.</span>
            <span>A productive and easy-to-manage task board.</span>
            <div class="flex flex-col mt-[0.5rem]">
                <input v-model="username" type="username" placeholder="Username"
                    class="input input-bordered border-2 bg-base-100 my-[1rem]" />
                <input v-model="password" type="password" placeholder="Password"
                    class="input input-bordered border-2 bg-base-100" />
                <button @click="handleLoginClick" :disabled="username.length === 0 || password.length === 0"
                    class="mt-[2rem] btn btn-secondary text-base rounded-full">Login</button>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
