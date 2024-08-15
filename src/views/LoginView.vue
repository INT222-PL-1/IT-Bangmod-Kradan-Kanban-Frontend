<script setup>
import IconSVG from '@/components/IconSVG.vue';
import { ref, watch } from 'vue'

const username = ref('')
const password = ref('')

watch(username, (newValue) => {
    if (newValue.length >= 50) username.value = newValue.substring(0, 50)
})

</script>

<template>
    <main class="h-screen grid place-items-center">
        <div class="flex flex-col">
            <IconSVG iconName="itbkk-logo" :scale="4" size="4rem" />
            <span class="text-[2rem] my-[1rem]">Login</span>
            <span>Welcome to IT-Bangmod Kradan Kanban.</span>
            <span>A productive and easy-to-manage task board.</span>
            <div class="flex flex-col mt-[1rem]">
                <input v-model="username" type="username" placeholder="Username"
                    class="input input-bordered bg-[#252B33] text-[#6F7378] my-[1rem]" />

                <input v-model="password" type="password" placeholder="Password"
                    class="input input-bordered bg-[#252B33] text-[#6F7378]" />
                <button :disabled="username.length === 0 || password.length === 0"
                    class="mt-[2rem] btn btn-secondary text-base rounded-full">Login</button>
            </div>
        </div>
    </main>
</template>

<style scoped></style>