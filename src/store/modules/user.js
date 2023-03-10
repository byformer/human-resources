import { getToken, setToken, removeToken,setTimeStamp } from "@/utils/auth"
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 状态
const state = {
  token: getToken(), // 设置token为共享状态
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token  // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken()  // 同步到缓存
  },
  setUserInfo(state, result) {
      
    state.userInfo = result // 这样是响应式
  },
  removeUserInfo(state) {

    // 更新一个对象
    state.userInfo = {}     
  
  },

}

const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    // console.log(context,data);
    context.commit("setToken", result)  // 设置token
    // 拿到token说明登录成功
    setTimeStamp()  // 设置当前时间戳
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo()  // 获取返回值
    // 获取用户详情
    const baseInfo = await getUserDetailById(result.userId)
    const obj = { ...result, ...baseInfo }
    context.commit('setUserInfo', obj) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要返回 为后面埋下伏笔
  },
  // 登出操作
   logout(context) {
   
    // 删除token，
    context.commit("removeToken")
    // 删除用户资料
    context.commit("removeUserInfo")
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}



