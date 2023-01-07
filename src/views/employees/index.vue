<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 左侧显示总记录 -->
        <!-- <span slot="before">共16条记录</span> -->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel 导出 新增员工-->
        <template v-slot:after>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true ">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" :data="list">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          :formatter="formatEmployment"
          sortable=""
        />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <!-- 作用域插槽 + 过滤器 -->
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template v-slot="obj">
            <!-- 将时间进行格式化 -->
            {{ obj.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template v-slot="obj">
            <el-switch :value="obj.row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template  slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev,pager,next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync 修饰符 -->
    <AddEmployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from "./components/add-employees"
export default {
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0 // 分页总数
      },
      loading: false, // 控制遮罩层
      showDialog:false, // 默认是关闭的弹层
    }
  },
  components:{
    AddEmployee,
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 最新的页面
    changePage(newPage) {
      this.page.page = newPage // 赋值最新的页面
      this.getEmployeeList() // 重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
   async deleteEmployee(id) {
      try {
        this.$confirm('确定删除该员工吗')
        // 点击了确定
          await delEmployee(id)
        this.$message.success('删除员工成功')
      
        this.getEmployeeList() // 重新拉取数据
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>

<style>
</style>

