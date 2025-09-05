<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = inject('auth')

const loginData = ref({
  username: '',
  password: ''
})

const errors = ref({
  username: null,
  password: null,
  general: null
})

// Hardcoded authentication credentials
const validCredentials = {
  username: 'admin',
  password: 'password123'
}

const validateUsername = () => {
  if (!loginData.value.username) {
    errors.value.username = 'Username is required'
  } else {
    errors.value.username = null
  }
}

const validatePassword = () => {
  if (!loginData.value.password) {
    errors.value.password = 'Password is required'
  } else {
    errors.value.password = null
  }
}

const handleLogin = () => {
  // Clear previous errors
  errors.value = {
    username: null,
    password: null,
    general: null
  }

  // Validate form
  validateUsername()
  validatePassword()

  if (errors.value.username || errors.value.password) {
    return
  }

  // Check credentials
  if (loginData.value.username === validCredentials.username &&
    loginData.value.password === validCredentials.password) {
    // Login successful, use global authentication method
    auth.login(loginData.value.username)

    // Redirect to home page
    router.push('/')
  } else {
    errors.value.general = 'Invalid username or password'
  }
}

const clearForm = () => {
  loginData.value = {
    username: '',
    password: ''
  }
  errors.value = {
    username: null,
    password: null,
    general: null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">🔐 Library Login</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="login-username" class="form-label">Username</label>
                <input type="text" class="form-control" id="login-username" v-model="loginData.username"
                  @blur="validateUsername" @input="validateUsername" :class="{ 'is-invalid': errors.username }" />
                <div v-if="errors.username" class="invalid-feedback">
                  {{ errors.username }}
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

              <div v-if="errors.general" class="alert alert-danger" role="alert">
                {{ errors.general }}
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary me-2">Login</button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
              </div>
            </form>

            <div class="mt-4 text-center">
              <small class="text-muted">
                Demo credentials: <strong>admin</strong> / <strong>password123</strong>
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
