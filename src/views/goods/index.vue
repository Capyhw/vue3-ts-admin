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
              <el-button :icon="Search" @click="getGoodsList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-button type="primary" size="default" @click="addGoods">
            添加商品
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column prop="goods_name" label="商品名称" align="center" />
      <el-table-column prop="goods_price" label="商品价格" align="center" />
      <el-table-column prop="goods_weight" label="商品重量" align="center" />
      <el-table-column prop="goods_number" label="商品库存" align="center" />
      <el-table-column prop="status" label="商品状态" align="center" />
      <el-table-column prop="add_time" label="创建时间" align="center">
        <template #default="{ row }">
          {{ formatTime(row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="upd_time" label="更新时间" align="center">
        <template #default="{ row }">
          {{ formatTime(row.upd_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            @click="editGoods(row)"
          ></el-button>
          <el-button
            type="warning"
            :icon="Delete"
            @click="delGoods(row.goods_id)"
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
  <Dialog2
    v-model:dialogVisible="dialogVisible"
    :title="title"
    :info="info"
    :pid="pId"
    @getGoodsList="getGoodsList"
  ></Dialog2>
</template>

<script setup lang="ts">
import { Search, Edit, Setting, Delete } from "@element-plus/icons-vue";
import { getList, deleteGoods } from "@/api/goods.js";
import { onMounted, ref } from "vue";
import { filterTimes } from "@/utils/filters.js";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import { useRouter } from "vue-router";
import Dialog2 from "./components/Dialog2.vue";
const i18n = useI18n();
const router = useRouter();
const params = ref({
  query: "",
  pagenum: 1,
  pagesize: 10,
});

//商品列表
const goodsList = ref([]);
//总页数
const total = ref(0);
//获取商品列表
const getGoodsList = async () => {
  const data = await getList(params.value);
  goodsList.value = data.goods;
  total.value = data.total;
  console.log(data);
};

//切换每页显示条数
const handleSizeChange = (val: number) => {
  params.value.pagesize = val;
  getGoodsList();
};
//切换当前页
const handleCurrentChange = (val: number) => {
  params.value.pagenum = val;
  getGoodsList();
};

//时间格式化
const formatTime = (time: number) => {
  return filterTimes(time);
};

//dialogVisible
const dialogVisible = ref(false);
//title
const title = ref("");
//info
const info = ref({
  goods_id: 0,
  goods_name: "",
  goods_price: "",
  goods_weight: "",
  goods_number: "",
  goods_introduce: "",
});
//参数id
const pId = ref(0);
//添加商品
const addGoods = () => {
  router.push("/goods/add");
};
//修改商品
const editGoods = async (row) => {
  pId.value = row.goods_id;
  info.value.goods_id = row.goods_id;
  info.value.goods_name = row.goods_name;
  info.value.goods_price = row.goods_price;
  info.value.goods_weight = row.goods_weight;
  info.value.goods_number = row.goods_number;
  info.value.goods_introduce = row.goods_introduce;
  title.value = "修改商品";
  dialogVisible.value = true;
};
//删除商品
const delGoods = (uid: number) => {
  ElMessageBox.confirm(i18n.t("dialog.deleteTitle"), "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteGoods(uid);
      handleClear(); //清空搜索条件
      ElMessage({
        type: "success",
        message: i18n.t("message.deleteSuccess"),
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18n.t("message.deleteError"),
      });
    });
};

//清空搜索条件
const handleClear = () => {
  params.value.query = "";
  getGoodsList();
};
//初始化
onMounted(() => {
  getGoodsList();
});
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
