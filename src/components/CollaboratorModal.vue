<script setup>

</script>

<template>
    <Transition>
        <BaseModal @clickBG="$emit('clickClose')" :show="show" :mobileCenter="true">
            <div class="absolute bg-base-300 w-[40rem] max-w-[90vw] rounded-xl h-auto overflow-hidden flex flex-col">
                <div class="text-2xl font-bold p-4 border-b-2 border-base-100 break-words flex-none">Add Collaborator
                </div>
            </div>
        </BaseModal>
    </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>

<style scoped></style>