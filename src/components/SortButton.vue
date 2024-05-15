<script setup>
import IconSVG from './IconSVG.vue'

const emits = defineEmits(['clickSortButton'])

const props = defineProps({
    currentSortBy: {
        type: String,
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
    },
    defaultSortBy: {
        type: String,
        require: true
    }
})

const handleSortButtonClick = () => {
    const sortData = {
        sortBy: props.sortBy,
        sortDirection: 'asc'
    }

    if (props.currentSortBy === props.sortBy) {
    //    sortData.sortDirection = props.currentSortDirection === 'asc' ? 'desc' : 'asc'
        if (props.currentSortDirection === 'asc') sortData.sortDirection = 'desc'
        else if (props.currentSortDirection === 'desc') {
            sortData.sortBy = props.defaultSortBy
            sortData.sortDirection = 'asc'
        }
    }

    emits('clickSortButton', sortData)
}

</script>

<template>
    <div @click="handleSortButtonClick">
        <IconSVG v-if="currentSortBy === sortBy && currentSortDirection === 'asc'" iconName="sort-alpha-down" color="#f04c1c" />
        <IconSVG v-else-if="currentSortBy === sortBy && currentSortDirection === 'desc'" iconName="sort-alpha-up" color="#f04c1c" />
        <IconSVG v-else iconName="sort-alpha-down" />
    </div>
</template>