<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <TreeTools @editDepts="editDepts" slot-scope="{ data }" :treeNode="data" @addDepts="addDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层 -->
    <AddDepartments ref="addDept" :showDialog.sync="showDialog" :treeNode="node" @addDepts="getDepartments"  />
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools";
import AddDepartments from "./components/add-dept"
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
export default {
  data() {
    return {
      company: {}, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: "name", // 表示从这个属性现实内容
      },
      showDialog:false, // 显示窗口
      node:null,  // 记录当前点击的节点
    };
  },
  created() {
    this.getDepartments(); // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      
      this.company = { name: result.companyName, manager: "负责人",id:'' };
      this.departs = tranListToTreeData(result.depts,'') // 需要将其转换树形
    },
    // 监听tree-tools中触发的点击子部门的事件
    // node是当前点击的部门
    addDepts(node){
      this.showDialog = true// 显示弹窗
      this.node = node 
    },
    // 编辑部门
   editDepts(node){ 
      this.showDialog = true // 弹出层
      this.node = node  // 赋值操作的节点
      // 调用获取部门详情方法
      this.$refs.addDept.getDepartDetail(node.id)
   }
  },
  components: {
    TreeTools,
    AddDepartments,
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

