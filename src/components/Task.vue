<template>
  <div class="bg-purple-800 p-4 rounded text-white" @click="$emit('update')">
    <h2>{{ task.title }}</h2>
    <small>
      {{
        formatDistance(task.timestamp.toDate(), new Date(), { addSuffix: true })
      }}
    </small>
  </div>
</template>

<script setup lang="ts">
import formatDistance from 'date-fns/formatDistance'
import { ITask } from '../types/task';

defineProps({
  task: {
    type: Object as () => ITask,
    required: true,
  }
});

</script>

<style scoped>
</style>
