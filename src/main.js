import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Firebase imports
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx59Zz_qCJyFREnOREjhJzYJxssELCB3I',
  authDomain: 'sli-library.firebaseapp.com',
  projectId: 'sli-library',
  storageBucket: 'sli-library.firebasestorage.app',
  messagingSenderId: '768078067361',
  appId: '1:768078067361:web:ee2ba5e20ff7fd6baf22e0',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

// Create Vue app
const app = createApp(App)

// Provide Firebase services globally
app.provide('firebaseApp', firebaseApp)
app.provide('firebaseDb', db)

app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
