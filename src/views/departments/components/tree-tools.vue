<template>
      <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="height: 40px;width:100%"
        >
          <el-col>
            <span>{{treeNode.name}}</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>{{treeNode.manager}}</el-col>
              <el-col>
                <!-- 下拉菜单 element -->
                <el-dropdown @command="operateDepts">
                  <span> 操作<i class="el-icon-arrow-down" /> </span>
                  <!-- 下拉菜单 -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                     <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
                     <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <!-- 右侧内容 -->
          </el-col>
        </el-row>
</template>

<script>
import {delDepartments} from '@/api/departments' 
export default {
    props:{
        // 定义传入属性
        treeNode:{
            required:true,
            type:Object
        },
        isRoot:{
            type:Boolean,
            default:false
        }
    },
    methods:{
      // 点击、编辑、删除、新增时触发
      operateDepts(type){
        if(type === 'add'){
          // 添加子部门
          // 在当前点击的部门添加子部门
          this.$emit('addDepts',this.treeNode) // 触发一个自定义事件，告诉父组件显示弹窗
        }else if(type === 'edit'){
          // 编辑部门
          this.$emit('editDepts',this.treeNode)  // 触发自定义事件，点击谁编辑谁
        }else{
          // 删除
         this.$confirm("您确定要删除该组织部门吗").then(()=> {
           return delDepartments(this.treeNode.id)
         }).then(() =>{
          //  只需要等到成功的时候 调用接口删除了，后端数据变化了，但是前端没变，重新获取
          this.$emit('delDepts')  // 触发自定义事件
          this.$message.success('删除部门成功')
         })
      }
    }
},
}
</script>

<style>
</style>