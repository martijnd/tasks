<template>
  <div class="bg-purple-800 p-4 rounded text-white">
    <h2>{{task.title}}</h2>
    <small>{{ task.date.toDate().toLocaleDateString() }}</small>
  </div>
</template>

<script setup lang="ts">
import { Task } from '../App.vue';

defineProps({
    task: {
        type: Object as () => Task,
        required: true,
    }
});

</script>

<style scoped>

</style>
