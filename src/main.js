import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './ele-ui'
import 'font-awesome/css/font-awesome.css'


Vue.config.productionTip = false

//事件监听总线，监听部分跳级的事件，如树节点
Vue.prototype.$bus = new Vue()

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')