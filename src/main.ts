import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY as string,
  authDomain: "tasks-72e5e.firebaseapp.com",
  projectId: "tasks-72e5e",
  storageBucket: "tasks-72e5e.appspot.com",
  messagingSenderId: "504643281928",
  appId: import.meta.env.VITE_APP_ID as string,
  measurementId: "G-VN5GZBCNWK"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const app = createApp(App);

app.mount('#app')
