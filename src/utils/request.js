import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { Date } from "core-js";
import { getTimeStamp } from "@/utils/auth"
import router from "@/router";
const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间
})
// 请求拦截器 

service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
    if (chekTimeOut()) {
      // 如果为true则表示过期了，
      // token没用了，超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error("token超时了"))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(
  response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  }, error => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 等于10002的时候表示后端告诉超时了
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)   // 提示错误信息
    }
    return Promise.reject(error)   // 返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
)
// 是否超时
// 超时逻辑，当前时间 - 缓存中的时间  是否大于时间差
function chekTimeOut() {
  var currentTime = Date.now()  // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
//  导出
export default service