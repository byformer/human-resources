// 员工路由规则
import Layout from "@/layout"
export default {
    // 路由规则
    path:'/departments', // 路由地址
    name:'departments', // 这里会在后面做权限时用到
    component:Layout,
    children:[{
        path:'',  // 这里不用写，什么不写表示 /employees ，不但有layout => 员工主页
        component:()=>import('@/views/departments'),
        // 路由元信息，其实就是储存数据的对象，可以放任何内容
        meta:{
            title:"组织架构", // 这里用title是因为左侧导航读取了这里的title属性
        }
    }]
}