import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
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
    meta: { requiresAuth: true }, // Mark as route requiring authentication
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // If user is not authenticated and tries to access protected route, redirect to access denied page
    next('/access-denied')
  } else if (to.path === '/login' && isAuthenticated) {
    // If user is authenticated and tries to access login page, redirect to home
    next('/')
  } else {
    // Allow access
    next()
  }
})

export default router
