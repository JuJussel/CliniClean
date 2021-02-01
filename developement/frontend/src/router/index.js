import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    // beforeEnter (to, from, next) {
    //   if (document.cookie.split('; ').find(row => row.startsWith('PHPSESSID'))) {
    //     next('/home')
    //   }
    //   else {
    //     next()
    //   }
    // }
  },
  {
    path: '/home',
    name: 'home',
    component: function () {
      return import( '../views/Home.vue')
    },
    // beforeEnter (to, from, next) {
    //   if (document.cookie.split('; ').find(row => row.startsWith('PHPSESSID'))) {
    //     next()
    //   }
    //   else {
    //     next('/')
    //   }
    // }
  }
]

const router = new VueRouter({
  routes
})

export default router
