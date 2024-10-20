<script setup>

</script>

<template>
    <div class="hidden sm:block bg-base-300 rounded-lg shadow-md relative">
      <div class="px-4 min-h-8 sticky top-[8rem] z-30 py-5 border-b-base-200 border-b-2 bg-base-300 rounded-t-lg">
        <div class="flex justify-between">
          <div class="flex gap-2">
            <slot name="left-menu"></slot>
          </div>
          <div class="flex gap-2">
            <slot name="right-menu"></slot>
          </div>
        </div>
      </div>
      <div class="table-overflow-x-scroll p-4 max-w-[85vw] relative">
        <slot name="table">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
                <th>Header 4</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 4" :key="i">
                <td>Data {{ 4 * (i - 1) + 1 }}</td>
                <td>Data {{ 4 * (i - 1) + 2 }}</td>
                <td>Data {{ 4 * (i - 1) + 3 }}</td>
                <td>Data {{ 4 * (i - 1) + 4 }}</td>
              </tr>
            </tbody>
          </table>
        </slot>
        <div class="h-16"></div>
      </div>
    </div>
</template>

<style scoped></style>
