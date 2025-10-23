<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">📚 Book Management - Update & Delete</h2>
          </div>
          <div class="card-body">
            <!-- Add Book Form -->
            <div class="mb-4">
              <h4>Add New Book</h4>
              <form @submit.prevent="addBook" class="row g-3">
                <div class="col-md-4">
                  <label for="isbn" class="form-label">ISBN:</label>
                  <input type="text" class="form-control" id="isbn" v-model="newBook.isbn" required />
                </div>
                <div class="col-md-4">
                  <label for="name" class="form-label">Book Name:</label>
                  <input type="text" class="form-control" id="name" v-model="newBook.name" required />
                </div>
                <div class="col-md-4">
                  <label for="author" class="form-label">Author:</label>
                  <input type="text" class="form-control" id="author" v-model="newBook.author" required />
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Adding...' : 'Add Book' }}
                  </button>
                </div>
              </form>
            </div>

            <hr>

            <!-- Books List -->
            <div class="mb-4">
              <h4>Books List</h4>
              <button @click="loadBooks" class="btn btn-outline-primary mb-3" :disabled="loading">
                {{ loading ? 'Loading...' : 'Refresh Books' }}
              </button>

              <div v-if="books.length === 0" class="alert alert-info">
                No books found. Add some books first!
              </div>

              <div v-else class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ISBN</th>
                      <th>Name</th>
                      <th>Author</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in books" :key="book.id">
                      <td>{{ book.isbn }}</td>
                      <td>
                        <input v-if="editingBook === book.id" v-model="book.name"
                          class="form-control form-control-sm" />
                        <span v-else>{{ book.name }}</span>
                      </td>
                      <td>
                        <input v-if="editingBook === book.id" v-model="book.author"
                          class="form-control form-control-sm" />
                        <span v-else>{{ book.author }}</span>
                      </td>
                      <td>{{ formatDate(book.createdAt) }}</td>
                      <td>
                        <div v-if="editingBook === book.id">
                          <button @click="updateBook(book)" class="btn btn-success btn-sm me-1">
                            Save
                          </button>
                          <button @click="cancelEdit" class="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                        </div>
                        <div v-else>
                          <button @click="startEdit(book)" class="btn btn-warning btn-sm me-1">
                            Edit
                          </button>
                          <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Status Messages -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            <div v-if="success" class="alert alert-success" role="alert">
              {{ success }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const db = getFirestore()

const books = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const editingBook = ref(null)

const newBook = ref({
  isbn: '',
  name: '',
  author: ''
})

// Load books from Firestore
const loadBooks = async () => {
  try {
    loading.value = true
    error.value = ''

    const querySnapshot = await getDocs(collection(db, 'books'))
    books.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('Books loaded:', books.value.length)
  } catch (err) {
    error.value = 'Error loading books: ' + err.message
    console.error('Error loading books:', err)
  } finally {
    loading.value = false
  }
}

// Add new book
const addBook = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    await addDoc(collection(db, 'books'), {
      isbn: parseInt(newBook.value.isbn),
      name: newBook.value.name,
      author: newBook.value.author,
      createdAt: serverTimestamp()
    })

    success.value = 'Book added successfully!'
    newBook.value = { isbn: '', name: '', author: '' }
    await loadBooks()
  } catch (err) {
    error.value = 'Error adding book: ' + err.message
    console.error('Error adding book:', err)
  } finally {
    loading.value = false
  }
}

// Start editing a book
const startEdit = (book) => {
  editingBook.value = book.id
}

// Cancel editing
const cancelEdit = () => {
  editingBook.value = null
  loadBooks() // Reload to reset changes
}

// Update book
const updateBook = async (book) => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    await updateDoc(doc(db, 'books', book.id), {
      name: book.name,
      author: book.author,
      updatedAt: serverTimestamp()
    })

    success.value = 'Book updated successfully!'
    editingBook.value = null
    console.log('Book updated:', book.id)
  } catch (err) {
    error.value = 'Error updating book: ' + err.message
    console.error('Error updating book:', err)
  } finally {
    loading.value = false
  }
}

// Delete book
const deleteBook = async (bookId) => {
  if (!confirm('Are you sure you want to delete this book?')) {
    return
  }

  try {
    loading.value = true
    error.value = ''
    success.value = ''

    await deleteDoc(doc(db, 'books', bookId))

    success.value = 'Book deleted successfully!'
    await loadBooks()
    console.log('Book deleted:', bookId)
  } catch (err) {
    error.value = 'Error deleting book: ' + err.message
    console.error('Error deleting book:', err)
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

// Load books on component mount
onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 95vw;
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

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>

