<template>
  <el-card shadow="always" :body-style="{ padding: '20px', height: '731px' }">
    <el-table :data="tableList" :heigth="731" style="width: 100%">
      <el-table-column type="index" width="180" />
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="authName" label="Name" width="180" />
      <el-table-column prop="path" label="PATH" />
      <el-table-column prop="pid" label="PID" />
      <el-table-column prop="level" label="权限等级">
        <template v-slot="{ row }">
          <el-tag effect="dark" type="success" v-if="row.level == 0"
            >一级
          </el-tag>
          <el-tag effect="dark" type="warning" v-else-if="row.level == 1"
            >二级
          </el-tag>
          <el-tag effect="dark" v-else-if="row.level == 2">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :currentPage="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="rightsList.length"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getRights } from "@/api/rights";
//权限列表
const rightsList = ref<any[]>([]);
//当前页数
const currentPage = ref(1);
//每页显示条数
const pageSize = ref(15);
//对权限列表进行分页
const tableList = computed(() => {
  return rightsList.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

//获取权限列表
const getRightsList = async (type: string) => {
  const res = await getRights(type);
  console.log(res);
  rightsList.value = res;
};
onMounted(() => {
  getRightsList("list");
});
//分页跳转
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};
</script>

<style lang="scss" scoped>
.el-card {
  position: relative;
  .el-pagination {
    position: absolute;
    bottom: 10px;
    right: 12%;
  }
}
</style>
