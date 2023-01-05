<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :treeNode="company" :isRoot="true" />
        <!-- 放置一个el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <TreeTools slot-scope="{ data }" :treeNode="data" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
export default {
  data() {
    return {
      company: {}, // 就是头部的数据结构
      departs: [
        {
          name: "总裁办",
          manager: "小明",
          children: [{ name: "董事会", manager: "张三" }],
        },
        { name: "行政部", manager: "李四" },
        { name: "人事部", manager: "小美" },
      ],
      defaultProps: {
        label: "name", // 表示从这个属性现实内容
      },
    };
  },
  created() {
    this.getDepartments(); // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      
      this.company = { name: result.companyName, manager: "负责人" };
      this.departs = tranListToTreeData(result.depts,'') // 需要将其转换树形
    },
  },
  components: {
    TreeTools,
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

