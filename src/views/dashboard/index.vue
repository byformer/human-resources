<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageTools :show-before="true">
      <template v-slot:before>
        <span>我想你们了</span>
      </template>
      <template v-slot:after>
        <el-button type="primary">导入excel</el-button>
      </template>
    </PageTools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
