import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import { sendkv } from "./sdk/statistics";
import VConsole from "vconsole";
//  css初始化
import "./common/css/normalize.css";

import { Button, Loading } from "vant";
import Test from './plugins/test'
Vue.use(Button);
Vue.use(Loading);
Vue.use(new Test(1))
/**
 * 注册数据上报到vue实例上
 */
Vue.prototype.sendkv = sendkv;

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
