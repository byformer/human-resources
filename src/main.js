import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import Component from '@/components'
import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives' // 导入指令管理
import '@/icons' // icon
import '@/permission' // permission control
import { Object } from 'core-js'
import * as filters from "@/filters"

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Component) // 注册自己的插件
// 遍历对象
Object.keys(directives).forEach(key =>{
    Vue.directive(key,directives[key])  // 注册自定义指令
})
Object.keys(filters).forEach(key =>{
  Vue.filter(key,filters[key]) // 注册自定义过滤器
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
