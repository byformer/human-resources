import { getToken, setToken, removeToken } from "@/utils/auth"
import { login, getUserInfo } from "@/api/user"
// 状态
const state = {
  token: getToken(), // 设置token为共享状态
  userInfo:{}   // 这里定义一个空对象
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
  setUserInfo(state,result){
    // 更新一个对象
    state.userInfo = result     // 这样是响应式
  },
  removeUserInfo(){
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token

    context.commit("setToken", result)  // 设置token

  },
  async getUserInfo() {
   const result =  await getUserInfo()   // 获取返回值
    context.commit('setUserInfo',result)  // 提交到mutations
    return result  // 这里为什么要return，这里是给后期做权限做下的伏笔
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

