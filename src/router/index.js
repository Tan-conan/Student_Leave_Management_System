import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../Pages/LoginPage.vue'
import SignUpPage from '../Pages/SignUpPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/signup', name: 'SignUp', component: SignUpPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
