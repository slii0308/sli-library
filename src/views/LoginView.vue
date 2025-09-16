<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from '@/composables/useFirebaseAuth'

const router = useRouter()
const { login, error, loading, clearError } = useFirebaseAuth()

const loginData = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: null,
  password: null
})

const validateEmail = () => {
  if (!loginData.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(loginData.value.email)) {
    errors.value.email = 'Email is invalid'
  } else {
    errors.value.email = null
  }
}

const validatePassword = () => {
  if (!loginData.value.password) {
    errors.value.password = 'Password is required'
  } else {
    errors.value.password = null
  }
}

const handleLogin = async () => {
  // Clear previous errors
  errors.value = {
    email: null,
    password: null
  }
  clearError()

  // Validate form
  validateEmail()
  validatePassword()

  if (errors.value.email || errors.value.password) {
    return
  }

  try {
    await login(loginData.value.email, loginData.value.password)
    // Login successful, redirect to home page
    router.push('/')
  } catch (err) {
    // Error is handled by the composable
    console.error('Login error:', err)
  }
}

const clearForm = () => {
  loginData.value = {
    email: '',
    password: ''
  }
  errors.value = {
    email: null,
    password: null
  }
  clearError()
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">🔐 Firebase Login</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="login-email" class="form-label">Email</label>
                <input type="email" class="form-control" id="login-email" v-model="loginData.email"
                  @blur="validateEmail" @input="validateEmail" :class="{ 'is-invalid': errors.email }" />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="login-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="login-password" v-model="loginData.password"
                  @blur="validatePassword" @input="validatePassword" :class="{ 'is-invalid': errors.password }" />
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary me-2" :disabled="loading">
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
              </div>
            </form>

            <div class="mt-4 text-center">
              <small class="text-muted">
                Use Firebase authentication to login
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 20px;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 30px;
}

.form-control:focus {
  border-color: #275fda;
  box-shadow: 0 0 0 0.2rem rgba(39, 95, 218, 0.25);
}

.btn-primary {
  background-color: #275fda;
  border-color: #275fda;
}

.btn-primary:hover {
  background-color: #1e4bb8;
  border-color: #1e4bb8;
}
</style>
