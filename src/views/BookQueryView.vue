<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">🔍 Book Query - Where, OrderBy, Limit</h2>
          </div>
          <div class="card-body">
            <!-- Query Controls -->
            <div class="row mb-4">
              <div class="col-md-12">
                <h4>Query Controls</h4>
                <div class="row g-3">
                  <!-- Where Clause -->
                  <div class="col-md-3">
                    <label for="whereField" class="form-label">Where Field:</label>
                    <select class="form-select" id="whereField" v-model="query.whereField">
                      <option value="">Select Field</option>
                      <option value="author">Author</option>
                      <option value="name">Book Name</option>
                      <option value="isbn">ISBN</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="whereOperator" class="form-label">Operator:</label>
                    <select class="form-select" id="whereOperator" v-model="query.whereOperator">
                      <option value="==">Equals (==)</option>
                      <option value="!=">Not Equals (!=)</option>
                      <option value=">">Greater Than (&gt;)</option>
                      <option value="<">Less Than (&lt;)</option>
                      <option value=">=">Greater or Equal (&gt;=)</option>
                      <option value="<=">Less or Equal (&lt;=)</option>
                      <option value="array-contains">Array Contains</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="whereValue" class="form-label">Value:</label>
                    <input type="text" class="form-control" id="whereValue" v-model="query.whereValue" />
                  </div>
                  <div class="col-md-3">
                    <label for="orderByField" class="form-label">Order By:</label>
                    <select class="form-select" id="orderByField" v-model="query.orderByField">
                      <option value="">No Order</option>
                      <option value="name">Book Name</option>
                      <option value="author">Author</option>
                      <option value="isbn">ISBN</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="orderDirection" class="form-label">Direction:</label>
                    <select class="form-select" id="orderDirection" v-model="query.orderDirection">
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="limit" class="form-label">Limit:</label>
                    <input type="number" class="form-control" id="limit" v-model="query.limit" min="1" max="100" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">&nbsp;</label>
                    <div>
                      <button @click="executeQuery" class="btn btn-primary me-2" :disabled="loading">
                        {{ loading ? 'Querying...' : 'Execute Query' }}
                      </button>
                      <button @click="clearQuery" class="btn btn-secondary">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Predefined Queries -->
            <div class="row mb-4">
              <div class="col-md-12">
                <h5>Predefined Queries (Click to Execute)</h5>
                <div class="d-flex flex-wrap gap-2">
                  <button @click="executePredefinedQuery('booksByAuthor')" class="btn btn-outline-primary btn-sm">
                    Books by Author
                  </button>
                  <button @click="executePredefinedQuery('recentBooks')" class="btn btn-outline-primary btn-sm">
                    Recent Books (Order by Date)
                  </button>
                  <button @click="executePredefinedQuery('limitBooks')" class="btn btn-outline-primary btn-sm">
                    Limit 5 Books
                  </button>
                  <button @click="executePredefinedQuery('booksByISBN')" class="btn btn-outline-primary btn-sm">
                    Books by ISBN Range
                  </button>
                  <button @click="executePredefinedQuery('allBooks')" class="btn btn-outline-primary btn-sm">
                    All Books
                  </button>
                </div>
              </div>
            </div>

            <!-- Query Results -->
            <div class="row">
              <div class="col-md-12">
                <h4>Query Results</h4>
                <div v-if="lastQuery" class="alert alert-info">
                  <strong>Last Query:</strong> {{ lastQuery }}
                </div>

                <div v-if="books.length === 0 && !loading" class="alert alert-warning">
                  No books found. Try a different query or add some books first.
                </div>

                <div v-if="books.length > 0" class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>ISBN</th>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="book in books" :key="book.id">
                        <td>{{ book.isbn }}</td>
                        <td>{{ book.name }}</td>
                        <td>{{ book.author }}</td>
                        <td>{{ formatDate(book.createdAt) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="text-muted">
                    Showing {{ books.length }} book(s)
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Messages -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
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
  query as firestoreQuery,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const db = getFirestore()

const books = ref([])
const loading = ref(false)
const error = ref('')
const lastQuery = ref('')

const query = ref({
  whereField: '',
  whereOperator: '==',
  whereValue: '',
  orderByField: '',
  orderDirection: 'asc',
  limit: 10
})

// Execute custom query
const executeQuery = async () => {
  try {
    loading.value = true
    error.value = ''
    books.value = []

    let q = collection(db, 'books')

    // Build where clause
    if (query.value.whereField && query.value.whereValue) {
      const field = query.value.whereField
      const operator = query.value.whereOperator
      const value = query.value.whereValue

      // Convert value based on field type
      let convertedValue = value
      if (field === 'isbn') {
        convertedValue = parseInt(value) || value
      }

      q = firestoreQuery(q, where(field, operator, convertedValue))
    }

    // Build order by clause
    if (query.value.orderByField) {
      q = firestoreQuery(q, orderBy(query.value.orderByField, query.value.orderDirection))
    }

    // Build limit clause
    if (query.value.limit && query.value.limit > 0) {
      q = firestoreQuery(q, limit(parseInt(query.value.limit)))
    }

    const querySnapshot = await getDocs(q)
    books.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Store query description
    lastQuery.value = buildQueryDescription()
    console.log('Query executed:', lastQuery.value, 'Results:', books.value.length)

  } catch (err) {
    error.value = 'Error executing query: ' + err.message
    console.error('Error executing query:', err)
  } finally {
    loading.value = false
  }
}

// Execute predefined queries
const executePredefinedQuery = async (queryType) => {
  try {
    loading.value = true
    error.value = ''
    books.value = []

    let q = collection(db, 'books')

    switch (queryType) {
      case 'booksByAuthor':
        q = firestoreQuery(q, where('author', '==', 'J.K. Rowling'))
        lastQuery.value = "WHERE author == 'J.K. Rowling'"
        break

      case 'recentBooks':
        q = firestoreQuery(q, orderBy('createdAt', 'desc'), limit(5))
        lastQuery.value = "ORDER BY createdAt DESC LIMIT 5"
        break

      case 'limitBooks':
        q = firestoreQuery(q, limit(5))
        lastQuery.value = "LIMIT 5"
        break

      case 'booksByISBN':
        q = firestoreQuery(q, where('isbn', '>', 1000), orderBy('isbn', 'asc'))
        lastQuery.value = "WHERE isbn > 1000 ORDER BY isbn ASC"
        break

      case 'allBooks':
        q = firestoreQuery(q, orderBy('name', 'asc'))
        lastQuery.value = "ORDER BY name ASC"
        break
    }

    const querySnapshot = await getDocs(q)
    books.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log(`Predefined query '${queryType}' executed:`, books.value.length, 'results')

  } catch (err) {
    error.value = 'Error executing predefined query: ' + err.message
    console.error('Error executing predefined query:', err)
  } finally {
    loading.value = false
  }
}

// Build query description
const buildQueryDescription = () => {
  let description = 'SELECT * FROM books'

  if (query.value.whereField && query.value.whereValue) {
    description += ` WHERE ${query.value.whereField} ${query.value.whereOperator} '${query.value.whereValue}'`
  }

  if (query.value.orderByField) {
    description += ` ORDER BY ${query.value.orderByField} ${query.value.orderDirection.toUpperCase()}`
  }

  if (query.value.limit && query.value.limit > 0) {
    description += ` LIMIT ${query.value.limit}`
  }

  return description
}

// Clear query
const clearQuery = () => {
  query.value = {
    whereField: '',
    whereOperator: '==',
    whereValue: '',
    orderByField: '',
    orderDirection: 'asc',
    limit: 10
  }
  books.value = []
  lastQuery.value = ''
  error.value = ''
}

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

// Load all books on component mount
onMounted(() => {
  executePredefinedQuery('allBooks')
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
  background-color: #28a745;
  color: white;
  padding: 20px;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 30px;
}

.form-control:focus,
.form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-primary:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-outline-primary {
  color: #28a745;
  border-color: #28a745;
}

.btn-outline-primary:hover {
  background-color: #28a745;
  border-color: #28a745;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
