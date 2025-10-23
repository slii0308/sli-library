<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">📚 Add Book</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN:</label>
                <input type="text" class="form-control" id="isbn" v-model="isbn" :class="{ 'is-invalid': errors.isbn }"
                  required />
                <div v-if="errors.isbn" class="invalid-feedback">
                  {{ errors.isbn }}
                </div>
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">Name:</label>
                <input type="text" class="form-control" id="name" v-model="name" :class="{ 'is-invalid': errors.name }"
                  required />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div v-if="success" class="alert alert-success" role="alert">
                Book added successfully!
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary me-2" :disabled="loading">
                  {{ loading ? 'Adding Book...' : 'Add Book' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const db = getFirestore()

const isbn = ref('')
const name = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const errors = ref({
  isbn: null,
  name: null
})

const validateForm = () => {
  errors.value = {
    isbn: null,
    name: null
  }

  if (!isbn.value) {
    errors.value.isbn = 'ISBN is required'
  } else if (!/^\d+$/.test(isbn.value)) {
    errors.value.isbn = 'ISBN must be a number'
  }

  if (!name.value) {
    errors.value.name = 'Name is required'
  }

  return !errors.value.isbn && !errors.value.name
}

const addBook = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    error.value = ''
    success.value = false

    // Add book to Firestore collection
    await addDoc(collection(db, 'books'), {
      isbn: parseInt(isbn.value), // Save as number instead of string
      name: name.value,
      createdAt: new Date()
    })

    success.value = true
    clearForm()
  } catch (err) {
    error.value = 'Error adding book: ' + err.message
    console.error('Error adding book:', err)
  } finally {
    loading.value = false
  }
}

const clearForm = () => {
  isbn.value = ''
  name.value = ''
  errors.value = {
    isbn: null,
    name: null
  }
  error.value = ''
  success.value = false
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
