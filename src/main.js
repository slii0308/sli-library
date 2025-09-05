import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Global authentication state management
import { ref } from 'vue'

// Create global authentication state
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const currentUser = ref(localStorage.getItem('currentUser') || null)

// Authentication methods
const login = (username) => {
  isAuthenticated.value = true
  currentUser.value = username
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('currentUser', username)
}

const logout = () => {
  isAuthenticated.value = false
  currentUser.value = null
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('currentUser')
}

const app = createApp(App)

// Provide global authentication state and methods
app.provide('auth', {
  isAuthenticated,
  currentUser,
  login,
  logout,
})

app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
