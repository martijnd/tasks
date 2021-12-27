<template>
  <div
    v-if="!confirmDelete && !confirmUpdate"
    class="p-4 min-h-20 text-white flex justify-between items-center bg-purple-800 hover:bg-purple-900 transition-all duration-150 cursor-pointer hover:shadow-lg rounded select-none"
    @click="confirmUpdate = true"
  >
    <div class="flex flex-col">
      <h2 class="font-semibold">{{ task.title }}</h2>
      <small :key="key">
        {{
          formatDistance(task.timestamp.toDate(), new Date(), { addSuffix: true, locale: nl })
        }}
      </small>
    </div>
    <button
      @click.stop="confirmDelete = true"
      class="rounded-full hover:bg-purple-600 h-10 w-10 font-bold transition-all duration-150"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 inline"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
  <div
    v-else-if="confirmUpdate"
    class="grid grid-cols-2 min-h-20 grid-rows-2 bg-purple-800 hover:bg-purple-900 rounded overflow-hidden"
  >
    <h3 class="col-span-2 text-center self-center font-bold">Update?</h3>
    <button @click="confirmUpdate = false" class="bg-orange-800 hover:bg-orange-900 py-2 font-semibold">No</button>
    <button @click="$emit('update'); confirmUpdate = false" class="bg-gray-500 hover:bg-green-700 py-2 font-semibold">Yes</button>
  </div>
  <div
    v-else
    class="grid grid-cols-2 min-h-20 grid-rows-2 bg-purple-800 hover:bg-purple-900 rounded overflow-hidden"
  >
    <h3 class="col-span-2 text-center self-center font-bold">Delete?</h3>
    <button @click="confirmDelete = false" class="bg-orange-800 hover:bg-orange-900 py-2 font-semibold">No</button>
    <button @click="$emit('delete')" class="bg-gray-500 hover:bg-green-700 py-2 font-semibold">Yes</button>
  </div>
</template>

<script setup lang="ts">
import formatDistance from 'date-fns/formatDistance'
import { ITask } from '../types/task';
import nl from 'date-fns/locale/nl'
import { ref } from 'vue';

defineProps({
  task: {
    type: Object as () => ITask,
    required: true,
  }
});
const key = ref(0);
const confirmDelete = ref(false);
const confirmUpdate = ref(false);

setInterval(() => {
  key.value++;
}, 10000)

</script>

<style scoped>
</style>
