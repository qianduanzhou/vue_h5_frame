import './public-path';
import Vue from "vue";
import App from "./App.vue";
import routes from "./router";
import Router from 'vue-router';
import store from "./store";
import VConsole from "vconsole";
//  css初始化
import "./common/css/normalize.css";
import "../public/lib/rem.js"
import {
  Button,
  Loading
} from "vant";
Vue.use(Button);
Vue.use(Loading);

/**
 * 错误上报
 */
Vue.config.errorHandler = function (err, vm, info) {
  console.log('err', err)
  console.log('vm', vm)
  console.log('info', info)
}

//  调试
if (process.env.VUE_APP_BASE_ENV === 'dev') {
  let vconsole = new VConsole()
}


Vue.config.productionTip = false;

/**
 * ↓↓↓ 这里是提供给主应用调用的生命周期钩子
 */
let router = null;
let instance = null;

function render(props = {}) {
  const {
    container
  } = props;
  Vue.use(Router)
  router = new Router({
    base: window.__POWERED_BY_QIANKUN__ ? '/vueApp/' : '/',
    mode: 'history',
    routes,
  });
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
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
/**
 * ↑↑↑
 */
