<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-button type="primary" size="default" @click="add"
            >添加角色
          </el-button>
        </el-col>
      </el-row>
    </template>
    <!-- card body -->
    <el-table :data="rolesList" border stripe style="width: 100%" row-key="id">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <el-row v-for="item in row.children" :key="item.id" class="rights">
            <!-- 一级 -->
            <el-col :span="5" class="firstCol">
              <el-tag
                size="large"
                effect="dark"
                class="firstTag"
                closable
                @close="removeRight(row, row.id, item.id)"
                >{{ item.authName }}
              </el-tag>
            </el-col>
            <!-- 二、三级 -->
            <el-col :span="19">
              <el-row v-for="item2 in item.children" :key="item2.id">
                <!-- 二级 -->
                <el-col :span="6" class="secCol">
                  <el-tag
                    type="success"
                    size="large"
                    effect="dark"
                    closable
                    @close="removeRight(row, row.id, item2.id)"
                    >{{ item2.authName }}
                  </el-tag>
                </el-col>
                <!-- 三级 -->
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    size="large"
                    effect="dark"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRight(row, row.id, item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
                <el-divider border-style="dotted" />
              </el-row>
            </el-col>
            <el-divider border-style="dotted" />
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleDesc" label="角色描述" />
      <el-table-column label="操作" width="200">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            @click="editRoles(row)"
          ></el-button>
          <el-button
            type="success"
            :icon="Setting"
            @click="setRoles(row)"
          ></el-button>
          <el-button
            type="warning"
            :icon="Delete"
            @click="delRoles(row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="rolesDialogVisible"
      title="Tips"
      width="50%"
      v-if="rolesDialogVisible"
    >
      <el-tree
        :data="permissionsList"
        :props="props"
        show-checkbox
        node-key="id"
        ref="rightsTree"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rolesDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleRights">Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
  <Dialog
    v-model:dialogVisible="dialogVisible"
    :title="title"
    @getRolesList="getRolesList"
    :info="info"
  ></Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Search, Edit, Setting, Delete } from "@element-plus/icons-vue";
import {
  getRoles,
  deleteRole,
  deleteRolePermission,
  getPermissions,
  grantRolePermission,
} from "@/api/roles";
import Dialog from "./components/Dialog.vue";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
const i18n = useI18n();
const rightsTree = ref();
//角色列表
const rolesList = ref<any[]>([]);
//获取角色列表
const getRolesList = async () => {
  const res = await getRoles();
  rolesList.value = res;
};
//dialogVisible
const dialogVisible = ref(false);
//title
const title = ref("");
//info
const info = ref({
  roleName: "",
  roleDesc: "",
});
//权限列表
const permissionsList = ref<any[]>([]);
//提前获取所有权限列表
const getPermissionsList = async () => {
  permissionsList.value = await getPermissions("tree");
};
//添加角色
const add = () => {
  info.value = {
    roleName: "",
    roleDesc: "",
  };
  dialogVisible.value = true;
  title.value = "请输入要添加角色的信息";
};
//编辑角色
const editRoles = (row) => {
  info.value = JSON.parse(JSON.stringify(row));
  dialogVisible.value = true;
  title.value = "请输入要编辑角色的信息";
};
//设置角色权限
const rolesDialogVisible = ref(false);
const props = {
  children: "children",
  label: "authName",
};
const defaultCheckedKeys = ref<any[]>([]);
//获取子节点
const getLeftKeys = (tree, arr) => {
  if (!tree.children) {
    return arr.push(tree.id);
  }
  tree.children.forEach((item) => {
    getLeftKeys(item, arr);
  });
};

const setRoles = async (row) => {
  roleId.value = row.id;
  defaultCheckedKeys.value = [];
  getLeftKeys(row, defaultCheckedKeys.value);
  rolesDialogVisible.value = true;
};
//删除角色
const delRoles = (uid: number) => {
  ElMessageBox.confirm(i18n.t("dialog.deleteTitle"), "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteRole(uid);
      getRolesList();
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
//删除某个权限
const removeRight = async (row, rowId: number, rightId: number) => {
  const res = await deleteRolePermission(rowId, rightId);
  // row.children = res;  //这两个都可以
  getRolesList();
};

//存储角色id
const roleId = ref<number>();
//添加权限
const handleRights = async () => {
  const checkedKeys = rightsTree.value.getCheckedKeys();
  const halfCheckedKeys = rightsTree.value.getHalfCheckedKeys();
  const rids = checkedKeys.concat(halfCheckedKeys);
  const ridStr = rids.join(",");
  console.log(ridStr);
  await grantRolePermission(roleId.value, ridStr);
  // getPermissionsList();
  getRolesList();
  rolesDialogVisible.value = false;
};
//初始化
onMounted(() => {
  //获取角色列表
  getRolesList();
  //提前获取所有权限列表
  getPermissionsList();
});
</script>

<style lang="scss" scoped>
.rights {
  .firstCol,
  .secCol {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.el-tag {
  margin: 1rem;
}
.el-divider {
  margin: 12px 0;
}
</style>
