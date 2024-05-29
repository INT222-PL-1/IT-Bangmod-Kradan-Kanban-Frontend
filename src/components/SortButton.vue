<script setup>
import IconSVG from './IconSVG.vue'

const emits = defineEmits(['clickSortButton'])

const props = defineProps({
    currentSortBy: {
        type: [String, null],
        required: true
    },
    currentSortDirection: {
        type: String,
        default: 'asc',
        validator: (value) => {
            return ['asc', 'desc'].includes(value)
        }
    },
    sortBy: {
        type: String,
        required: true
    }
})

const handleSortButtonClick = () => {
    const sortData = {
        sortBy: props.sortBy,
        sortDirection: 'asc'
    }

    if (props.currentSortBy === props.sortBy) {
        if (props.currentSortDirection === 'asc') sortData.sortDirection = 'desc'
        else if (props.currentSortDirection === 'desc') {
            sortData.sortBy = null
            sortData.sortDirection = null
        }
    }

    emits('clickSortButton', sortData)
}

</script>

<template>
    <div @click="handleSortButtonClick" class="cursor-pointer w-4 h-4">
        <Transition>
            <IconSVG v-if="currentSortBy === sortBy && currentSortDirection === 'asc'" iconName="sort-alpha-down"
                color="#f04c1c" class="absolute" />
            <IconSVG v-else-if="currentSortBy === sortBy && currentSortDirection === 'desc'" iconName="sort-alpha-up"
                color="#f04c1c" class="absolute" />
            <IconSVG v-else iconName="sort-alpha-down" class="absolute" />
        </Transition>
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease-in;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
