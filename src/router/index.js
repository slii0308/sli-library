import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import AddBookView from '@/views/AddBookView.vue'
import BookManagementView from '@/views/BookManagementView.vue'
import BookQueryView from '@/views/BookQueryView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    // your routes here
  ],
})

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView,
  },
  {
    path: '/book-management',
    name: 'BookManagement',
    component: BookManagementView,
  },
  {
    path: '/book-query',
    name: 'BookQuery',
    component: BookQueryView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true },
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView,
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guards
router.beforeEach((to, from, next) => {
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Check Firebase auth state - look for Firebase auth token
    const firebaseAuth = localStorage.getItem('firebase:authUser')
    const isAuthenticated = firebaseAuth && firebaseAuth !== 'null' && firebaseAuth !== 'undefined'

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to access denied')
      next('/access-denied')
    } else {
      console.log('User authenticated, allowing access')
      next()
    }
  } else {
    next()
  }
})

export default router
