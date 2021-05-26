import Vue from 'vue'
import store from '@/src/store'
import App from './App'
import api from '@/src/api/index.js'
import url from '@/src/common/config.js'
import router from '@/src/router'
import { RouterMount } from 'uni-simple-router'

import uView from "@/src/plugins/uview-ui";
Vue.use(uView);

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole)


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = api
Vue.prototype.$url = url
Vue.prototype.$fullUrl = url+"hh/"
App.mpType = 'app'

const app = new Vue({
	...App
})
// #ifdef H5
	RouterMount(app, '#app');
// #endif

// #ifndef H5
	app.$mount();
// #endif

