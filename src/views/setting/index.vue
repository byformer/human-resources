<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary"
              @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 给表格绑定数据 -->
            <el-table border="" :data="list">
              <el-table-column
                type="index"
                align="center"
                prop="id"
                label="序号"
                width="120"
              />
              <el-table-column
                prop="name"
                align="center"
                label="名称"
                width="240"
              />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row
              type="flex"
              justify="center"
              style="height: 60px"
              align="middle"
            >
              <el-pagination
                :total="page.total"
                :page-size="page.pageSize"
                :current-page="page.page"
                @current-change="changePage"
                layout="prev,pager,next"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 右侧内容  -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="400px"
                />
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹窗组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCncel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
       <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
      </el-form-item> 

      <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
      </el-form-item> 
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCncel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole,getRoleDetail,updateRole,addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及数据
        page: 1,
        pageSize: 10,
        total: 0
      },
      formData: {
        // 公司信息
      },
      showDialog:false,  // 控制弹层显示
      roleForm:{
        name:'', // 角色名称
        description:'', // 角色描述
      },
      rules:{
        name:[{required:true,message:'角色名称不能为空',trigger:'blur'}]
      }
    }
  },
  created() {
    this.getRoleList() //获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      // newPage是当前点击的对象
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗')
        //  只有点击了确定才能到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载
        this.$confirm('删除角色成功！')
      } catch (err) {
        console.log(err)
      }
    },
   async editRole(id){
       this.roleForm = await getRoleDetail(id)  // 实现数据的回写
       this.showDialog = true  // 显示图层
    },
   async btnOk(){
    try{
       await this.$refs.roleForm.validate()
    //  只有校验通过的情况下才会执行await的下方内容
    //  有id就是编辑，没有则是新增
    if(this.roleForm.id){
       await updateRole(this.roleForm)
    }else{
      // 新增业务
        await addRole(this.roleForm)
    }
      //  重新拉取数据
      this.getRoleList()
      this.$message.success('操作成功')
      this.showDialog = false // 关闭弹层
    }catch(err){
      console.log(err);
    }
    

    },
    btnCncel(){
        this.roleForm = {
          name:'',
          description:''
        }
        // 移除校验规则
        this.$refs.roleForm.resetFields()
        this.showDialog = false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  }
}
</script>

<style>
</style>

