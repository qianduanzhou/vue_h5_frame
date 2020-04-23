import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
      path: '/404', // 页面不存在的情况下会跳到404页面
      component: () => import(/* webpackChunkName: "error" */ '../views/404.vue'),
      name: '404',
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  if (to.matched.length === 0) { 
    if (from.name) {
      next({
        name: from.name
      }) 
    } else {
      next('/404'); 
    }  
  } else {
    next(); //如果匹配到正确跳转
  }
});

export default router