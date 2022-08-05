<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-button type="primary" size="default" @click="addCat"
            >添加分类
          </el-button>
        </el-col>
      </el-row>
    </template>
    <!-- card body -->
    <el-tree :data="categoryList" :props="treeProps" node-key="cat_id">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span> {{ data.cat_name }} </span>
          <el-icon v-if="data.cat_deleted"><CircleCloseFilled /></el-icon>
          <el-icon v-else><CircleCheckFilled /></el-icon>
          <el-tag
            type="success"
            size="default"
            effect="dark"
            v-if="data.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            type="warning"
            size="default"
            effect="dark"
            v-if="data.cat_level === 1"
            >二级</el-tag
          >
          <el-tag
            type="danger"
            size="default"
            effect="dark"
            v-if="data.cat_level === 2"
            >三级</el-tag
          >
        </span>
        <el-button
          type="primary"
          :icon="Edit"
          size="small"
          @click="editCat(node, data)"
          >编辑</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          size="small"
          @click="deleteCat(node, data)"
          >删除</el-button
        >
      </template>
    </el-tree>
    <el-pagination
      v-model:currentPage="query.pagenum"
      v-model:page-size="query.pagesize"
      :page-sizes="[10, 30, 50, 100]"
      background
      layout="sizes, prev, pager, next,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <Dialog
    v-model:dialogVisible="dialogVisible"
    :title="title"
    :info="info"
    @getCategoryList="getCategoryList"
  ></Dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getGoodsList, deleteCategory } from "@/api/category.js";
import {
  CircleCloseFilled,
  CircleCheckFilled,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import Dialog from "./components/Dialog.vue";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
const i18n = useI18n();
//商品分类列表
const categoryList = ref([]);
//请求参数
const query = ref({
  type: 3,
  pagenum: 1,
  pagesize: 10,
});
//总条数
const total = ref(0);
//获取商品分类列表
const getCategoryList = async () => {
  const res = await getGoodsList(query.value);
  categoryList.value = res.result;
  total.value = res.total;
};
//树形组件数据
const treeProps = {
  label: "cat_name",
  children: "children",
};

//更改每页数量
const handleSizeChange = (val: number) => {
  query.value.pagesize = val;
  query.value.pagenum = 1;
  getCategoryList();
};
//更改当前页
const handleCurrentChange = (val: number) => {
  query.value.pagenum = val;
  getCategoryList();
};

//dialogVisible
const dialogVisible = ref(false);
//title
const title = ref("");
//info
const info = ref({
  cat_pid: 0,
  cat_name: "",
  cat_level: 0,
  cat_id: 0,
});
//添加分类
const addCat = () => {
  dialogVisible.value = true;
  title.value = "添加分类";
};
//删除分类
const deleteCat = async (node: any, data: any) => {
  console.log(node, data);
  await deleteCategory(data.cat_id);
  ElMessage({
    message: i18n.t("message.addSuccess"),
    type: "success",
  });
  node.data.cat_deleted = true;
  getCategoryList();
};

//编辑分类
const editCat = (node: any, data: any) => {
  console.log(node, data);
  dialogVisible.value = true;
  title.value = "编辑分类";
  info.value = {
    cat_name: data.cat_name,
    cat_level: data.cat_level,
    cat_pid: data.cat_pid,
    cat_id: data.cat_id,
  };
};
onMounted(() => {
  //获取商品分类列表
  getCategoryList();
});
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
