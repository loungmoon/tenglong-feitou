import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'

const routes = [
   {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/layout',
    name: "layout",
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { layout: 'default',requiresAuth: true}
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to,from,next)=>{
  const token = localStorage.getItem("token")

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.guest && token) {
    next('/layout')
  } else {
    next()
  }
})

export default router
