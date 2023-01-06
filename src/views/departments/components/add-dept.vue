<template>
  <!-- 弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <!-- label-width 设置所有标题宽度 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native 修饰符可以找到原生的事件 -->
        <el-select
          @focus="getSimple"
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <!-- 遍历选项 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
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
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
} from "@/api/departments";
import { getSimple } from "@/api/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  // 计算属性
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  data() {
    // 检查部门名称是否重复
    const chekName = async (rule, value, callback) => {
      // value 就是部门名称，要和同级部门下的部门去比较，有相同不能过
      const { depts } = await getDepartments();
      // 找到所有子部门
      const isRepeat = depts
        .filter((item) => item.pid === this.treeNode.id)
        .some((item) => item.name === value);
      // 如果 isRepeat 为true 表示找到了一样的名字
      isRepeat
        ? callback(new Error(`同级部门下已经存在这个${value}部门了`))
        : callback();
    };
    // 检查编码是否重复
    const chekCode = async (rule, value, callback) => {
      // value 就是部门名称，要和同级部门下的部门去比较，有相同不能过
      const { depts } = await getDepartments();
      // 要求编码 和所有部门的编码不能重复，由于历史数据可能没有code，所以要加一个强制条件,value不能为空
      const isRepeat = depts.some((item) => item.code === value && value);
      // 如果 isRepeat 为true 表示找到了一样的编码
      isRepeat
        ? callback(new Error(`组织架构下已经存在这个${value}编码了`))
        : callback();
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门名称长度为1-50个字符" },
          { trigger: "blur", validator: chekName },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门编码长度为1-50个字符" },
          { trigger: "blur", validator: chekCode },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门介绍长度为1-300个字符" },
        ],
      }, // 效验规则 {key:数组}
      peoples: [],
    };
  },
  methods: {
    async getSimple() {
      this.peoples = await getSimple();
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
    btnOk() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          // 表单通过
          await addDepartments({ ...this.formData, pid: this.treeNode.id });
          // 告诉父组件更新数据
          this.$emit("addDepts"); // 触发自定义事件

          // 此时应该去修改showdialog
          // update: 固定写法，然后给父组件加上修饰符.sync
          this.$emit("update:showDialog", false);
          // 关闭dialog的时候，会触发el-dialog事件，所以这里不需要再单独的重置数据
        }
      });
    },
    // 取消
    btnCancel() {
      // 重置数据只能重置表单数据，比如编辑id不能重置
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
      // 关闭弹层
      this.$emit("update:showDialog", false);
      // 清除之前的效验   可以重置数据，但是只能重置自定在data的数据
      this.$refs.deptForm.resetFields();
    },
  },
};
</script>

<style>
</style>