<template>
  <!-- 弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单数据 -->
    <el-form :model="formData" :rules="rules" label-width="120px">
      <!-- label-width 设置所有标题宽度 -->
      <el-form-item  label="部门名称"  prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width: 80%" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
        v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 确认和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {getDepartments} from "@/api/departments"
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode:{
        type:Object,
        default:null
    }
  },
  data() {
    // 检查部门名称是否重复
    const chekName = async(rule,value,callback) =>{
        // value 就是部门名称，要和同级部门下的部门去比较，有相同不能过
        const {depts} = await getDepartments()
        // 找到所有子部门
       const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        // 如果 isRepeat 为true 表示找到了一样的名字
        isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    };
    // 检查编码是否重复
    const chekCode = async(rule,value,callback) =>{
        // value 就是部门名称，要和同级部门下的部门去比较，有相同不能过
        const {depts} = await getDepartments()
        // 要求编码 和所有部门的编码不能重复，由于历史数据可能没有code，所以要加一个强制条件,value不能为空
        const isRepeat= depts.some(item => item.code === value && value)
         // 如果 isRepeat 为true 表示找到了一样的编码
        isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules:{
         name: [{required:true,message:'部门名称不能为空',trigger:'blur'},
            {min:1,max:50,message:'部门名称长度为1-50个字符'},
            {trigger:'blur',validator:chekName}],
        code: [{required:true,message:'部门编码不能为空',trigger:'blur'},
         {min:1,max:50,message:'部门编码长度为1-50个字符'},
         {trigger:'blur',validator:chekCode}],
        manager: [{required:true,message:'部门负责人不能为空',trigger:'blur'}], 
        introduce: [{required:true,message:'部门介绍不能为空',trigger:'blur'},
         {min:1,max:50,message:'部门介绍长度为1-300个字符'}], 
      }  // 效验规则 {key:数组}
    };
  },
};
</script>

<style>
</style>