<template>
  <el-dialog title="新增员工" :visible="showDialog">
    <!-- 表单 -->
    <el-form :model="formatDate" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input style="width: 50%" v-model="formatDate.username" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="手机" prop="mobile">
        <el-input style="width: 50%" v-model="formatDate.mobile" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker style="width: 50%" v-model="formatDate.timeOfEntry" placeholder="请选择入职时间" />
      </el-form-item>

      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select style="width: 50%" v-model="formatDate.formOfEmployment" placeholder="请选择聘用形式" >
            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="工号" prop="workNumber">
        <el-input style="width: 50%" v-model="formatDate.workNumber" placeholder="请输入工号" />
      </el-form-item>

      <el-form-item label="部门" prop="departmentName">
        <el-input style="width: 50%" v-model="formatDate.departmentName" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个树形组件 -->
        <el-tree @node-click="selectNode"
         v-loading="loading" v-if="showTree"
          :data="treeData" :props="{label:'name'}"
           :default-expand-all="true" />
      </el-form-item>

      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker style="width: 50%" v-model="formatDate.correctionTime" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <el-row type="flex" justify="center" slot="footer">
      <el-col :span="6">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {getDepartments} from "@/api/departments"
 import {tranListToTreeData} from "@/utils"
 import EmployeeEnum from "@/api/constant/employees"
export default {
  data() {
    return {
        EmployeeEnum,
        // 定义表单数据
        formatDate: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules:{
        username:[{required:true,message:'用户姓名不能为空',trigger:'blur'},{
            min:1,max:4,message:'用户姓名为1-4位',trigger:'blur'
        }],
          mobile:[{required:true,message:'手机号不能为空',trigger:'blur'},{
            pattern:/^1[3-9]\d{9}$/,
            message:'手机号格式不正确',
            trigger:'bulr'
        }],
           formOfEmployment:[{required:true,message:'聘用形式不能为空',trigger:'blur'}],
           workNumber:[{required:true,message:'工号不能为空',trigger:'blur'}],
           departmentName:[{required:true,message:'部门不能为空',trigger:'change'}],
             timeOfEntry:[{required:true,message:'入职时间',trigger:'blur'}],
      },
      treeData:[], // 定义一个数组来接收树形结构
      showTree:false,  // 默认不显示树形
      loading:false, // 加上进度条 
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
  },
  methods:{
   async getDepartments(){
    this.showTree = true
    this.loading = true
        const {depts} = await getDepartments()
        // depts 是一个数组，它需要转换成一个树形结构，才能被el-tree显示
       this.treeData = tranListToTreeData(depts,'')
       this.loading = false
    },
    selectNode(node){
       this.formatDate.departmentName = node.name
       this.showTree = false
    }
  }
}
</script>

<style>
</style>