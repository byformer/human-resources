const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,   // 建立token的快捷访问
  avatar: state => state.app.avatar,
  name:state => state.app.name,
}
export default getters
