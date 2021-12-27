
<template>
  <div class="min-w-screen min-h-screen grid place-items-center bg-purple-700">
    <div v-if="!loading" class="wrapper">
      <h1 class="font-bold text-2xl text-purple-200">Taken</h1>
      <button v-if="!user" @click="signIn">Sign in with Google</button>
      <div v-else>
        <button @click="signOut">Sign out</button>
        <pre class="text-white">{{ user.displayName }}</pre>
        <div v-if="tasks" v-for="task of tasks">
          <Task :task="task" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  signOut as signOutFirebase,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import Task from './components/Task.vue';

const user = ref<User | null>(null);
const auth = getAuth();
const db = getFirestore();
const loading = ref(true);
const signIn = async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const res = await signInWithPopup(auth, new GoogleAuthProvider());
    user.value = res.user;
  } catch (e) {
    console.log(e)
  }
}

export type Task = {
title: string;
date: Timestamp;
};

const tasks = ref<Task[]>([]);

function signOut() {
  signOutFirebase(auth);
  user.value = null;
}

onMounted(() => {
  onAuthStateChanged(auth, async (currUser) => {
    if (currUser) {
      user.value = currUser;
      const docSnap  = await getDoc(doc(db, 'users', user.value.uid));
      if (docSnap.exists()) {
        console.log(docSnap.data());
        tasks.value = docSnap.data() as Task[];
      }

    }
    loading.value = false;
  })
})
</script>


<style>
</style>
