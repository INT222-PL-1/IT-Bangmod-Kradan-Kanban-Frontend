<script setup>
import IconSVG from '@/components/IconSVG.vue';
import { ref } from 'vue'

const usernameInput = ref('')
const passwordInput = ref('')

</script>

<template>
    <main class="h-screen grid place-items-center">
        <div class="flex flex-col">
            <IconSVG iconName="itbkk-logo" :scale="4" size="4rem" />
            <span class="text-[2rem] my-[1rem]">Login</span>
            <span>Welcome to IT-Bangmod Kradan Kanban.</span>
            <span>A productive and easy-to-manage task board.</span>
            <div class="flex flex-col mt-[1rem]">
                <input :value @input="event => username = event.target.value" type="username" placeholder="Username"
                    class="input input-bordered bg-[#252B33] text-[#6F7378] my-[1rem]" />
                <span v-if="usernameInput.length > 50">Username can not be more than 50 characters</span>
                {{ usernameInput.length }}
                <input v-model="passwordInput" type="text" placeholder="Password"
                    class="input input-bordered bg-[#252B33] text-[#6F7378]" />
                <span v-if="passwordInput.length > 50">Username can not be more than 50 characters</span>
                {{ passwordInput.lenght }}
                <button class="mt-[2rem] btn btn-secondary text-base rounded-full">Login</button>
            </div>
        </div>
    </main>
</template>

<style scoped></style>