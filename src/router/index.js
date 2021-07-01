import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Classified from '../components/Classified.vue'
import Brand from '../components/Brand.vue'
import Specifications from '../components/Specifications.vue'
// import Parameter from '../components/Parameter.vue'
import Recommend from '../components/Recommend.vue'
import Order from '../components/Order.vue'
import Commodity from '../components/Commodity.vue'
import Add from '../components/Add.vue'
import Edit from '../components/Edit.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/Classified',
    children: [
      { path: '/Classified', component: Classified },
      { path: '/Brand', component: Brand },
      { path: '/Specifications', component: Specifications },
      // { path: '/Parameter', component: Parameter },
      { path: '/Recommend', component: Recommend },
      { path: '/Order', component: Order },
      { path: '/Commodity', component: Commodity },
      { path: '/Add', component: Add },
      { path: '/Edit', component: Edit }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
