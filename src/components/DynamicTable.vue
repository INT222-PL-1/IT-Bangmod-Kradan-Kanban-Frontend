<script setup>

const props = defineProps({
  tableClass: {
    type: String,
    default: 'w-[80vw]'
  },
  colsCount: {
    type: Number,
    default: 4
  },
  colHeadersClass: {
    type: Array,
    default: () => [ 'w-1/12', 'w-5/12', 'w-4/12', 'w-2/12' ]
  },
  colsClass: {
    type: Array,
    default: () => [ 'w-1/12', 'w-5/12', 'w-4/12', 'w-2/12' ]
  },
  items: {
    type: Array,
    default: () => []
  },
  itemsKey: {
    type: String
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isError: {
    type: Boolean,
    default: false
  }
})

if (props.colsCount !== props.colHeadersClass.length || props.colsCount !== props.colsClass.length) {
  throw new Error('colsCount must be equal to colHeadersClass.length and colsClass.length')
}

</script>

<template>
  <div :class="tableClass">
    <div class="flex text-sm border-b border-base-100 select-none">
      <div v-for="i in colsCount" :key="i" :class="colHeadersClass[i - 1]" class="px-4 py-3 font-semibold text-[#888c90ee] flex items-center">
        <slot :name="`col-header-${i}`">{{ 'col-header-' + i }}</slot>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <slot name="loading">Loading...</slot>
    </div>
    <div v-else-if="isError" class="flex justify-center items-center h-40">
      <slot name="error">Error...</slot>
    </div>
    <div v-else-if="items.length === 0" class="flex justify-center items-center h-40">
      <slot name="empty">No data...</slot>
    </div>
    <div v-else v-for="(item, index) in items" :key="itemsKey ? items[itemsKey] : index" :class="{ 'bg-base-200': index % 2 !== 0 }" class="flex">
      <div v-for="j in colsCount" :key="j" :class="colsClass[j - 1]" class="px-4 py-3 flex items-center">
        <slot :name="`col-${j}`" :item="item" :index="index">{{ 'col-' + j }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
