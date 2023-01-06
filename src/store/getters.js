const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,   // 建立token的快捷访问
  avatar: state => state.app.avatar,

  name:state => state.user.userInfo.username,  // 建立对于用户名的快捷访问
  userId:state => state.user.userInfo.userId,  // 用户id
  staffPhoto:state => state.user.userInfo.staffPhoto, // 建立用户头像快捷访问
  companyId:state => state.user.userInfo.companyId // 建立对于公司id快捷访问

}
export default getters
