
<template>
  <div
    class="grid min-h-screen text-purple-100 bg-purple-700 min-w-screen place-items-center"
  >
    <div v-if="!loading" class="wrapper">
      <MButton v-if="!user" @click="signIn">Inloggen met Google</MButton>
      <div v-else>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-purple-200">Taken</h1>
          <MButton @click="signOut">Uitloggen</MButton>
        </div>
        <hr class="mt-4 mb-8 border-purple-500" />
        <div>
          <div v-if="tasks.length" class="space-y-2">
            <Task
              v-for="task of tasks"
              :task="task"
              @update="() => updateTimestamp(task)"
              @delete="() => deleteTask(task)"
            />
          </div>
          <div
            v-else
            class="grid h-24 mb-4 text-lg italic bg-purple-600 rounded place-items-center"
          >Nog geen taken!</div>
          <form
            @submit.prevent="addTask"
            class="flex flex-col p-4 mt-4 space-y-4 bg-purple-900 rounded-lg"
          >
            <h3 class="text-xl font-bold text-center text-white">Nieuwe taak</h3>
            <input
              class="w-full rounded text-black"
              type="text"
              v-model="title"
              placeholder="Titel"
            />
            <input
              class="w-full text-black rounded"
              type="datetime-local"
              v-model="timestamp"
              placeholder="Datum/tijd"
            />
            <MButton
              class="px-4 py-2 font-semibold text-white bg-purple-600 rounded"
              type="submit"
            >Toevoegen</MButton>
          </form>
        </div>
      </div>
    </div>
    <div v-else>Laden...</div>
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
import { collection, doc, getDoc, getFirestore, updateDoc, Timestamp, onSnapshot, query, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import Task from './components/Task.vue';
import { ITask } from './types/task';
import format from 'date-fns/format';
import MButton from './components/MButton.vue';

const user = ref<User | null>(null);
const auth = getAuth();
const db = getFirestore();
const loading = ref(true);
const title = ref('');
const timestamp = ref(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

async function signIn() {
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

async function deleteTask(task: ITask) {
  if (user.value) {
    await deleteDoc(doc(db, 'users', user.value.uid, 'tasks', task.uid));
  }
}

async function addTask() {
  if (user.value) {

    await addDoc(collection(db, 'users', user.value.uid, 'tasks'), {
      title: title.value,
      timestamp: Timestamp.fromDate(new Date(timestamp.value))
    })

    title.value = '';
    timestamp.value = format(new Date(), "yyyy-MM-dd'T'HH:mm")
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
