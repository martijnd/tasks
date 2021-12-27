<template>
  <div class="p-4 text-white flex justify-between items-center bg-purple-800 rounded select-none" @click="$emit('update')">
    <div class="flex flex-col">
      <h2>{{ task.title }}</h2>
      <small>
        {{
          formatDistance(task.timestamp.toDate(), new Date(), { addSuffix: true, locale: nl })
        }}
      </small>
    </div>
    <button @click="$emit('delete')" class="rounded-full bg-purple-600 h-10 w-10 font-bold">-</button>
  </div>
</template>

<script setup lang="ts">
import formatDistance from 'date-fns/formatDistance'
import { ITask } from '../types/task';
import nl from 'date-fns/locale/nl'

defineProps({
  task: {
    type: Object as () => ITask,
    required: true,
  }
});

</script>

<style scoped>
</style>
