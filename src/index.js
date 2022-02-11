import Vue from 'vue'
import WebCam from "./webcam";
import App from './App'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'

const install = function (Vue, opts = {}) {
  if (install.installed) return;
  Vue.component(WebCam.name, WebCam);
};

const plugin = {
  WebCam,
  install
};
Vue.use(plugin)
Vue.use(Element)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
