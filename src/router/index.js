import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Minesweeper from '../views/Minesweeper.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/campo-smerdato',
    name: 'campo-smerdato',
    component: Minesweeper
  }
]

const router = new VueRouter({
  routes
})

export default router
