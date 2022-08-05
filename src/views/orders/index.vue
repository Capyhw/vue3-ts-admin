<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-input
            v-model="params.query"
            placeholder="Please input"
            class="input-with-select"
            clearable
            @clear="handleClear"
          >
            <template #append>
              <el-button :icon="Search" @click="getOrders" />
            </template>
          </el-input>
        </el-col>
      </el-row>
    </template>
    <el-table :data="ordersList" border stripe>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column prop="order_number" label="订单编号" align="center" />
      <el-table-column prop="order_price" label="订单价格" align="center" />
      <el-table-column prop="pay_status" label="是否付款" align="center">
        <template #default="{ row }">
          {{ row.pay_status == 1 ? "已付款" : "未付款" }}
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" align="center" />
      <el-table-column prop="create_time" label="创建时间" align="center">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center">
        <template #default="{ row }">
          {{ formatTime(row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            @click="editOrder(row)"
          ></el-button>
          <el-button
            type="warning"
            :icon="Delete"
            @click="delOrder(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[10, 30, 50, 100]"
      background
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { get } from "@/api/orders.js";
import { Search, Edit, Setting, Delete } from "@element-plus/icons-vue";
import { filterTimes } from "@/utils/filters.js";

//ordersList请求参数
const params = ref({
  query: "",
  pagenum: 1,
  pagesize: 10,
});
//订单列表
const ordersList = ref([]);
//总页数
const total = ref(0);
//初始化订单列表
const getOrders = async () => {
  const res = await get(params.value);
  ordersList.value = res.goods;
  total.value = res.total;
  console.log(res);
};
//清除搜索条件
const handleClear = () => {
  params.value.query = "";
  getOrders();
};
//切换每页显示条数
const handleSizeChange = (val: number) => {
  params.value.pagesize = val;
  getOrders();
};
//切换当前页
const handleCurrentChange = (val: number) => {
  params.value.pagenum = val;
  getOrders();
};
//时间格式化
const formatTime = (time: number) => {
  return filterTimes(time);
};

//编辑订单
const editOrder = (row: any) => {
  console.log(row);
};
//删除订单
const delOrder = (id: number) => {
  console.log(id);
};
onMounted(() => {
  getOrders();
});
</script>

<style lang="scss" scoped></style>
