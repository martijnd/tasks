
<template>
  <div class="min-w-screen min-h-screen grid place-items-center bg-purple-700">
    <div v-if="!loading" class="wrapper">
      <h1 class="font-bold text-2xl text-purple-200">Taken</h1>
      <button v-if="!user" @click="signIn">Sign in with Google</button>
      <div v-else>
        <button @click="signOut">Sign out</button>
        <pre class="text-white">{{ user.displayName }}</pre>
        <div v-if="tasks" v-for="task of tasks">
          <Task :task="task" @update="() => updateTimestamp(task)" />
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
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, Timestamp, onSnapshot, query } from 'firebase/firestore';
import Task from './components/Task.vue';
import { ITask } from './types/task';

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


async function updateTimestamp(task: ITask) {
  if (user.value) {
    const docSnap = await getDoc(doc(db, 'users', user.value.uid, 'tasks', task.uid));
    await updateDoc(docSnap.ref, {
      timestamp: Timestamp.now()
    });
  }
}

const tasks = ref<ITask[]>([]);

function signOut() {
  signOutFirebase(auth);
  user.value = null;
}

onMounted(() => {
  onAuthStateChanged(auth, async (currUser) => {
    if (currUser) {
      user.value = currUser;
      onSnapshot(query(collection(db, "users", user.value.uid, 'tasks')), (snapshot) => {
        tasks.value = [];
        snapshot.forEach((doc) => {
          tasks.value = [...tasks.value, { uid: doc.id, ...doc.data() } as ITask];
        });
      });
    }
    loading.value = false;
  })
})
</script>


<style>
</style>
