import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    children: []
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
