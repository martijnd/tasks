
<template>
  <div class="min-w-screen min-h-screen grid place-items-center bg-purple-700">
    <div v-if="!loading" class="wrapper">
      <h1 class="font-bold text-2xl text-purple-200">Taken</h1>
      <button v-if="!user" @click="signIn">Sign in with Google</button>
      <div v-else>
        <button @click="signOut">Sign out</button>
        <pre class="text-white">{{ user.displayName }}</pre>
        <div v-if="tasks" class="space-y-2">
          <Task
            v-for="task of tasks"
            :task="task"
            @update="() => updateTimestamp(task)"
          />
        </div>
        <form @submit.prevent="addTask" class="flex flex-col">
          <input class="w-full" type="text" v-model="title" placeholder="Title" />
          <input
            class="w-full"
            type="datetime-local"
            v-model="timestamp"
            placeholder="Datetime"
          />
          <button
            class="bg-purple-600 rounded my-2 py-2 px-4 text-white font-semibold"
            type="submit"
          >Add</button>
        </form>
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
import { collection, doc, getDoc, getFirestore, updateDoc, Timestamp, onSnapshot, query, addDoc, getDocs } from 'firebase/firestore';
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

const title = ref('');
const timestamp = ref(new Date().toDateString());

async function addTask() {
  if (user.value) {

    await addDoc(collection(db, 'users', user.value.uid, 'tasks'), {
      title: title.value,
      timestamp: Timestamp.fromDate(new Date(timestamp.value))
    })

    title.value = '';
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
