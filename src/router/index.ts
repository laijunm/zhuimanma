import { createRouter, createWebHistory } from 'vue-router'
import MyHome from '../views/MyHome/MyHome.vue'
import MyClassify from '../views/MyClassify/MyClassify.vue'
import MyBookself from '../views/MyBookself/MyBookself.vue'
import MyUser from '../views/MyUser/MyUser.vue'
import LoginPage from '../views/MyUser/LoginPage.vue'
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MyHome
    },
    {
      path: '/classify',
      name: 'classify',
      component: MyClassify
    },
    {
      path: '/bookself',
      name: 'bookself',
      component: MyBookself
    },
    {
      path: '/user',
      name: 'user',
      component: MyUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/details',
      name: 'details',
      component: CartoonDetailsPage
    },
   

  ]
})

export default router
