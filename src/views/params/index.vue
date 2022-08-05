<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        <el-alert
          title="只能为第三级分类设置相关参数"
          type="warning"
          show-icon
          :closable="false"
        />
        <el-row>
          <el-col>
            <span>选择商品分类</span>
            <el-cascader
              :options="categoryList"
              :props="casProps"
              clearable
              v-model="setOptions"
              popper-class="cascader-popper"
              @change="getParams"
            />
          </el-col>
        </el-row>
      </div>
    </template>
    <el-tabs
      tab-position="left"
      class="demo-tabs"
      v-model="activeName"
      @tab-change="handleTabsClick"
    >
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          size="default"
          @click="addSort"
          :disabled="setOptions === null || setOptions.length === 0"
          >添加参数
        </el-button>
        <el-table :data="manyTableData" border stripe>
          <el-table-column label="参数名" prop="attr_name" />
          <el-table-column label="参数值" prop="attr_vals" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="editSort(row)">编辑</el-button>
              <el-button type="danger" @click="deleteSort(row.attr_id)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button
          type="primary"
          size="default"
          @click="addSort"
          :disabled="setOptions === null || setOptions.length === 0"
          >添加参数
        </el-button>
        <el-table :data="onlyTableData" border stripe>
          <el-table-column label="参数名" prop="attr_name" />
          <el-table-column label="参数值" prop="attr_vals" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="editSort(row)">编辑</el-button>
              <el-button type="danger" @click="deleteSort(row.attr_id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <Dialog
    v-model:dialogVisible="dialogVisible"
    :title="title"
    :info="info"
    :uid="uid"
    :pid="pId"
    @getParams="getParams"
  ></Dialog>
</template>

<script setup lang="ts">
import { getGoodsList } from "@/api/category.js";
import { onMounted, ref } from "vue";
import { getParamsList } from "@/api/params.js";
import Dialog from "./components/Dialog.vue";
import { delParams } from "@/api/params.js";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
const i18n = useI18n();
//级联选择器
const casProps = {
  label: "cat_name",
  value: "cat_id",
  children: "children",
  expandTrigger: "hover",
  // checkStrictly: true,
};
//商品分类列表
const categoryList = ref([]);
//级联选择器选择的值
const setOptions = ref([]);
//请求参数
const query = ref({
  type: 3,
});

//获取商品分类列表
const getCategoryList = async () => {
  const res = await getGoodsList(query.value);
  categoryList.value = res;
  console.log(res);
};
//获取参数列表
const getParams = async () => {
  if (setOptions.value !== null) {
    if (setOptions.value.length === 3) {
      uid.value = setOptions.value[2];
      const res = await getParamsList(setOptions.value[2], activeName.value);
      if (activeName.value === "many") {
        manyTableData.value = res;
      } else {
        onlyTableData.value = res;
      }
    } else {
      setOptions.value = [];
    }
    //清空级联选择器后，清空table
  } else {
    manyTableData.value = [];
    onlyTableData.value = [];
  }
};
//被激活的tab
const activeName = ref("many");

//tabs点击事件
const handleTabsClick = () => {
  getParams();
};
//动态参数表格数据
const manyTableData = ref([]);
//静态参数表格数据
const onlyTableData = ref([]);

//dialogVisible
const dialogVisible = ref(false);
//title
const title = ref("");
//info
const info = ref({
  attr_name: "",
  attr_vals: "",
  attr_sel: "",
});
//uid(分类id)
const uid = ref(0);
//参数id
const pId = ref(0);
//添加分类
const addSort = () => {
  dialogVisible.value = true;
  //清空表单
  info.value = {
    attr_name: "",
    attr_vals: "",
    attr_sel: "",
  };
  if (activeName.value === "many") {
    title.value = "添加动态参数";
    info.value.attr_sel = "many";
  } else {
    title.value = "添加静态参数";
    info.value.attr_sel = "only";
  }
};
//删除分类
const deleteSort = async (attr_id: number) => {
  await delParams(uid.value, attr_id);
  ElMessage({
    message: i18n.t("message.addSuccess"),
    type: "success",
  });
  getParams();
};

//编辑分类
const editSort = (row) => {
  dialogVisible.value = true;
  title.value = "编辑参数";
  info.value = {
    attr_name: row.attr_name,
    attr_vals: row.attr_vals,
    attr_sel: row.attr_sel,
  };
  pId.value = row.attr_id;
};
onMounted(() => {
  //获取商品分类列表
  getCategoryList();
});
</script>

<style lang="scss" scoped>
.el-col {
  margin: 15px 0 0 0;
}
</style>
