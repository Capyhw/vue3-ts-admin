<template>
  <div>
    <el-dialog
      :model-value="props.dialogVisible"
      :title="title"
      width="40%"
      @close="handleClose"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="default"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm(formRef)"
            >确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { addRole, editRole } from "@/api/roles";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
const i18n = useI18n();
//info的类型
type IUser = {
  id?: number;
  roleName: string;
  roleDesc?: string;
};
const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  info: IUser;
}>();
const emits = defineEmits(["update:dialogVisible", "getRolesList"]);
const formRef = ref<FormInstance>();
const form = ref<IUser>({
  roleName: "",
  roleDesc: "",
});
//uid
const uid = ref(0);
//表单验证规则
const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: "Please input roleName", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  roleDesc: [
    { required: false, message: "Please roleDesc", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});
//监测info
watch(
  () => props.info,
  (val: IUser) => {
    //把info的值赋给form,uid
    form.value = {
      roleName: val.roleName,
      roleDesc: val.roleDesc || "",
    };
    uid.value = val.id || 0;
    //如果是添加用户则清空表单
    if (props.title === "请输入要添加角色的信息") {
      form.value = {
        roleName: "",
        roleDesc: "",
      };
    }
  },
  { immediate: true, deep: true }
);

const handleClose = () => {
  emits("update:dialogVisible", false);
};
const handleConfirm = async (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  await formRef.validate(async (valid: boolean) => {
    if (valid) {
      const res =
        props.title === "请输入要添加角色的信息"
          ? await addRole(form.value)
          : await editRole(uid.value, form.value);
      if (res) {
        ElMessage({
          message: i18n.t("message.addSuccess"),
          type: "success",
        });
        emits("getRolesList");
        handleClose();
      } else {
        ElMessage({
          message: i18n.t("message.addFailed"),
          type: "error",
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped></style>
