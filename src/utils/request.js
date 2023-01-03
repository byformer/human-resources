import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间
})
// 请求拦截器 

service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
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
    Message.error(error.message)   // 提示错误信息
    return Promise.reject(error)   // 返回执行错误，让当前的执行链跳出成功，直接进入catch

  }
)
//  导出
export default service