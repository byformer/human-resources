<template>
<div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 个人详情 -->
             <component :is="userComponent" />
          
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getUserDetailById} from '@/api/user'
import {saveUserDetailById} from "@/api/employees"
import UserInfo from './components/userInfo'
import JobInfo from "./components/jobInfo"
export default {
  data(){
    return {
        userComponent:'UserInfo',
        jobInfo:'JobInfo',
        userId:this.$route.params.id,  // 直接将路由中的参数赋值给data属性
        userInfo:{
            username:'',
            password2:''  // 为什么叫password2， 因为password中是密文
        },rules:{
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
        }
    }
  },
  components:{
      UserInfo,
      JobInfo,
  },
  created(){
    this.getUserDetailById()
  },
  methods:{
   async getUserDetailById(){
       this.userInfo = await getUserDetailById(this.userId)
        
    },
    saveUser(){
        // 调用方法首先校验
        this.$refs.userForm.validate().then(async() =>{
            await saveUserDetailById({...this.userInfo,passowrd:this.userInfo.password2})
            this.$message('修改用户信息成功')
        })
    }
  }
}
</script>

<style>

</style>

