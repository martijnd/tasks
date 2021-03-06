
<template>
  <div
    class="grid min-h-screen px-2 text-stone-100 bg-stone-700 min-w-screen place-items-center py-8"
  >
    <div v-if="!loading" class="wrapper">
      <MButton v-if="!user" @click="signIn">Inloggen met Google</MButton>
      <div v-else>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-stone-200">Taken</h1>
          <MButton @click="signOut">Uitloggen</MButton>
        </div>
        <hr class="mt-4 mb-8 border-stone-500" />
        <div>
          <div v-if="tasks.length" class="space-y-2">
            <Task
              v-for="task of tasks"
              :key="task.uid"
              :task="task"
              @update="() => updateTask(task)"
              @delete="() => deleteTask(task)"
            />
          </div>
          <div
            v-else
            class="grid h-24 mb-4 text-lg italic bg-stone-600 rounded place-items-center"
          >Nog geen taken!</div>
          <form
            @submit.prevent="addTask"
            class="flex flex-col p-4 mt-4 space-y-4 bg-stone-900 rounded"
          >
            <h3 class="text-xl font-bold text-center text-white">Nieuwe taak</h3>
            <input
              class="w-full text-stone-900 rounded bg-stone-300"
              type="text"
              ref="titleInput"
              v-model="title"
              placeholder="Titel"
            />
            <input
              class="w-full text-stone-900 rounded bg-stone-300"
              type="datetime-local"
              v-model="timestamp"
              placeholder="Datum/tijd"
            />
            <MButton
              class="px-4 py-2 font-semibold text-white bg-stone-600 rounded"
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
import {
  collection,
  doc, 
  getDoc, 
  getFirestore, 
  updateDoc, 
  Timestamp, 
  onSnapshot, 
  query, 
  addDoc, 
  deleteDoc
} from 'firebase/firestore';
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
const titleInput = ref<HTMLInputElement | null>(null);

async function signIn() {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const res = await signInWithPopup(auth, new GoogleAuthProvider());
    user.value = res.user;
  } catch (e) {
    console.log(e)
  }
}


function signOut() {
  signOutFirebase(auth);
  user.value = null;
}

async function addTask() {
  if (user.value && title.value.length && timestamp.value.length) {
    await addDoc(collection(db, 'users', user.value.uid, 'tasks'), {
      title: title.value,
      timestamp: Timestamp.fromDate(new Date(timestamp.value)),
      createdAt: Timestamp.now()
    })

    title.value = '';
    timestamp.value = format(new Date(), "yyyy-MM-dd'T'HH:mm")

    if (titleInput.value) {
      titleInput.value.focus();
    }
  }
}

async function updateTask(task: ITask) {
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


const tasks = ref<ITask[]>([]);

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
