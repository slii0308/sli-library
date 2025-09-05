<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card text-center">
          <div class="card-header">
            <h1 class="text-danger mb-0">🚫 Access Denied</h1>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <i class="fas fa-lock fa-5x text-muted mb-3"></i>
              <h3 class="text-muted">Authentication Required</h3>
              <p class="lead">
                You need to be logged in to access this page.
              </p>
              <p class="text-muted">
                Please log in with your credentials to continue.
              </p>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <button class="btn btn-primary btn-lg me-md-2" @click="goToLogin">
                <i class="fas fa-sign-in-alt me-2"></i>
                Go to Login
              </button>
              <button class="btn btn-outline-secondary btn-lg" @click="goToHome">
                <i class="fas fa-home me-2"></i>
                Back to Home
              </button>
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
  background-color: #dc3545;
  color: white;
  padding: 20px;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 40px 30px;
}

.btn-primary {
  background-color: #275fda;
  border-color: #275fda;
}

.btn-primary:hover {
  background-color: #1e4bb8;
  border-color: #1e4bb8;
}

.fa-lock {
  color: #6c757d !important;
}
</style>
