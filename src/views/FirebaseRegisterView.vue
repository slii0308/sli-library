<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">📝 Firebase Register</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="register-email" class="form-label">Email</label>
                <input type="email" class="form-control" id="register-email" v-model="email"
                  :class="{ 'is-invalid': errors.email }" />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="register-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="register-password" v-model="password"
                  :class="{ 'is-invalid': errors.password }" />
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3">
                <label for="register-role" class="form-label">Role</label>
                <select class="form-select" id="register-role" v-model="role" :class="{ 'is-invalid': errors.role }">
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                  <option value="user">User</option>
                </select>
                <div v-if="errors.role" class="invalid-feedback">
                  {{ errors.role }}
                </div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary me-2" :disabled="loading">
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
              </div>
            </form>

            <div class="mt-4 text-center">
              <small class="text-muted">
                Create a new account with Firebase authentication
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useFirebaseAuth } from '@/composables/useFirebaseAuth'

const router = useRouter()
const { register: registerUser, error, loading, clearError } = useFirebaseAuth()

const email = ref("")
const password = ref("")
const role = ref("")

const errors = ref({
  email: null,
  password: null,
  role: null
})

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email is invalid'
  } else {
    errors.value.email = null
  }
}

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = null
  }
}

const validateRole = () => {
  if (!role.value) {
    errors.value.role = 'Role is required'
  } else {
    errors.value.role = null
  }
}

const handleRegister = async () => {
  // Clear previous errors
  errors.value = {
    email: null,
    password: null,
    role: null
  }
  clearError()

  // Validate form
  validateEmail()
  validatePassword()
  validateRole()

  if (errors.value.email || errors.value.password || errors.value.role) {
    return
  }

  try {
    await registerUser(email.value, password.value, role.value)
    // Registration successful, redirect to login page
    router.push("/FireLogin")
  } catch (err) {
    // Error is handled by the composable
    console.error('Registration error:', err)
  }
}

const clearForm = () => {
  email.value = ""
  password.value = ""
  role.value = ""
  errors.value = {
    email: null,
    password: null,
    role: null
  }
  clearError()
}
</script>

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
