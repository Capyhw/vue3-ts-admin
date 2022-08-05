<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <el-row :gutter="20" class="card-header">
      <el-col :span="4" :offset="0">
        <el-input
          v-model="queryForm.query"
          :placeholder="$t('table.placeholder')"
          clearable
        ></el-input>
      </el-col>
      <div class="header-button">
        <el-button type="primary" :icon="Search" @click="getUserList">
          {{ $t("table.search") }}
        </el-button>
      </div>
      <el-col :span="4" :offset="0">
        <el-input
          v-model="searchId"
          :placeholder="$t('table.idPlaceHolder')"
          clearable
        ></el-input>
      </el-col>
      <div class="header-button">
        <el-button type="primary" :icon="Search" @click="idSearch">
          {{ $t("table.search") }}
        </el-button>
      </div>
      <el-button type="primary" @click="add" class="addUser">
        {{ $t("table.adduser") }}
      </el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :formatter="formatter"
        :width="item.width"
        v-for="item in options"
        :key="item.id"
      >
        <template v-if="item.prop == 'mg_state'" v-slot="{ row }">
          <el-switch
            v-model="row.mg_state"
            @change="changeStatus(row.id, row.mg_state)"
          />
        </template>
        <template #default="{ row }" v-else-if="item.prop == 'action'">
          <el-button
            type="primary"
            :icon="Edit"
            @click="editUser(row)"
          ></el-button>
          <el-button
            type="success"
            :icon="Setting"
            @click="setRoles(row)"
          ></el-button>
          <el-button
            type="warning"
            :icon="Delete"
            @click="delUser(row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :currentPage="queryForm.pagenum"
      :page-size="queryForm.pagesize"
      :page-sizes="[20, 50, 100]"
      layout="prev, pager, next,sizes,jumper,total"
      :total="totalPage"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <Dialog
    v-model:dialogVisible="dialogVisible"
    :title="title"
    @getUserList="getUserList"
    :info="info"
    :roles="roles"
  ></Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search, Edit, Setting, Delete } from "@element-plus/icons-vue";
import { users, changeUserStatus, deleteUser } from "@/api/users.js";
import { getRoles } from "@/api/roles.js";
import { options } from "./options.js";
import { filterTimes } from "@/utils/filters.js";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import Dialog from "./components/Dialog.vue";
const i18n = useI18n();
const queryForm = ref({
  query: "",
  pagenum: 1,
  pagesize: 20,
});
const searchId = ref();
const tableData = ref([]);
//总页数
const totalPage = ref(0);
//搜索功能
const getUserList = async () => {
  const res = await users(queryForm.value);
  tableData.value = res.users;
  totalPage.value = res.total;
};
//根据id搜索
const idSearch = async () => {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].id == searchId.value) {
      tableData.value = [tableData.value[i]];
      totalPage.value = 1;
      return;
    }
  }
};
getUserList();
//时间格式化
const formatter = (row, column, cellValue) => {
  if (column.label == "创建时间") {
    return filterTimes(cellValue, "YYYY-MM-DD-HH-mm-ss");
  } else {
    return cellValue;
  }
};
//分页
const handleSizeChange = (val: number) => {
  queryForm.value.pagesize = val;
  queryForm.value.pagenum = 1;
  getUserList();
};
const handleCurrentChange = (val: number) => {
  queryForm.value.pagenum = val;
  getUserList();
};
//改变用户状态
const changeStatus = async (id: number, mg_state: boolean) => {
  await changeUserStatus(id, mg_state);
  ElMessage({
    message: i18n.t("message.updeteSuccess"),
    type: "success",
  });
};

//dialogVisible
const dialogVisible = ref(false);
//title
const title = ref("");
//info
const info = ref({
  username: "",
  password: "",
  email: "",
  mobile: "",
});
//选择器的选项
const roles = ref([]);
//添加用户
const add = () => {
  info.value = {
    username: "",
    password: "",
    email: "",
    mobile: "",
  };
  dialogVisible.value = true;
  title.value = "请输入要添加用户的信息";
};

//编辑用户
const editUser = (row) => {
  info.value = JSON.parse(JSON.stringify(row));
  dialogVisible.value = true;
  title.value = "请输入要编辑用户的信息";
};
//删除用户
const delUser = (uid: number) => {
  ElMessageBox.confirm(i18n.t("dialog.deleteUser"), "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteUser(uid);
      getUserList();
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
//设置用户角色
const setRoles = async (row) => {
  console.log(row);
  const res = await getRoles();
  roles.value = JSON.parse(
    JSON.stringify(
      res.map((item) => {
        return {
          label: item.roleName,
          value: item.id,
        };
      })
    )
  );
  info.value = JSON.parse(JSON.stringify(row));
  dialogVisible.value = true;
  title.value = "分配角色";
  // const res = await setUserRoles(row.id, 30);
  // getUserList();
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  padding-bottom: 16px;
  .header-button {
    margin-left: 10px;
  }
  .addUser {
    margin-left: auto;
    margin-right: 110px;
  }
}
</style>
