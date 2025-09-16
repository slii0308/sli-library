import { ref, computed } from 'vue'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx59Zz_qCJyFREnOREjhJzYJxssELCB3I',
  authDomain: 'sli-library.firebaseapp.com',
  projectId: 'sli-library',
  storageBucket: 'sli-library.firebasestorage.app',
  messagingSenderId: '768078067361',
  appId: '1:768078067361:web:ee2ba5e20ff7fd6baf22e0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Global state
const user = ref(null)
const userRole = ref(null)
const loading = ref(false)
const error = ref(null)

// Computed
const isAuthenticated = computed(() => !!user.value)

// Initialize auth state listener
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    user.value = firebaseUser
    // Get user role from Firestore
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role || 'user'
      } else {
        userRole.value = 'user' // Default role
      }
    } catch (err) {
      console.error('Error getting user role:', err)
      userRole.value = 'user'
    }
  } else {
    user.value = null
    userRole.value = null
  }
})

// Login function
const login = async (email, password) => {
  try {
    loading.value = true
    error.value = null
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (err) {
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}

// Register function
const register = async (email, password, role = 'user') => {
  try {
    loading.value = true
    error.value = null
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Save user role to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      role: role,
      createdAt: new Date(),
    })

    return userCredential.user
  } catch (err) {
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}

// Logout function
const logout = async () => {
  try {
    loading.value = true
    error.value = null
    await signOut(auth)
  } catch (err) {
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}

// Clear error
const clearError = () => {
  error.value = null
}

export function useFirebaseAuth() {
  return {
    // State
    user: computed(() => user.value),
    userRole: computed(() => userRole.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Methods
    login,
    register,
    logout,
    clearError,
  }
}
