<template>
  <div>
    <el-dialog
      :model-value="props.dialogVisible"
      :title="title"
      width="40%"
      @close="handleClose"
    >
      <el-form
        v-if="props.title !== '分配角色'"
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="default"
      >
        <el-form-item
          label="用户名"
          prop="username"
          v-if="title === '请输入要添加用户的信息'"
        >
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-if="title === '请输入要添加用户的信息'"
        >
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm(formRef)"
              >确认
            </el-button>
          </span>
        </el-form-item>
      </el-form>

      <el-form
        v-if="props.title == '分配角色'"
        :model="form"
        label-width="80px"
        :inline="false"
        size="default"
      >
        <el-form-item label="当前用户">
          <p>{{ form.username }}</p>
        </el-form-item>
        <el-form-item label="当前角色">
          <p>{{ form.role_name }}</p>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select-v2
            v-model="selectValue"
            :options="props.roles"
            placeholder="Please select"
          />
        </el-form-item>
        <el-form-item>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSetRole">确认 </el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { addUser, editUser } from "@/api/users";
import { setRoles } from "@/api/roles";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
const i18n = useI18n();
//info的类型
type IUser = {
  id?: number;
  username: string;
  password: string;
  email: string;
  mobile: string;
  role_name?: string;
  mg_state?: boolean;
};
//roles的类型
type IRole = {
  label: string;
  value: number;
};
const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  info: IUser;
  roles: IRole;
}>();
const emits = defineEmits(["update:dialogVisible", "getUserList"]);
const formRef = ref<FormInstance>();
//表单数据
const form = ref<IUser>({
  username: "",
  password: "",
  email: "",
  mobile: "",
});
//表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      message: "Please input email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  mobile: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});
//监测info
watch(
  () => props.info,
  (val: IUser) => {
    //把info的值赋给form
    form.value = {
      id: val.id,
      username: val.username || "",
      password: val.password || "",
      email: val.email || "",
      mobile: val.mobile || "",
    };
    //如果是分配角色则赋值用户名和角色
    if (props.title === "分配角色") {
      form.value.username = val.username;
      form.value.role_name = val.role_name;
    }
    //如果是添加用户则清空表单
    if (props.title === "请输入要添加用户的信息") {
      form.value = {
        username: "",
        password: "",
        email: "",
        mobile: "",
      };
    }
    console.log(form.value);
  },
  { immediate: true, deep: true }
);
//选择器的数据
const selectValue = ref<number>();
//关闭按钮
const handleClose = () => {
  emits("update:dialogVisible", false);
  selectValue.value = undefined;
};
//表单提交按钮
const handleConfirm = async (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  await formRef.validate(async (valid: boolean) => {
    let res;
    if (valid) {
      console.log(form.value);
      if (props.title === "请输入要添加用户的信息") {
        res = await addUser(form.value);
      }
      if (props.title === "请输入要编辑用户的信息") {
        res = await editUser(form.value);
      }
      if (res) {
        ElMessage({
          message: i18n.t("message.addSuccess"),
          type: "success",
        });
        emits("getUserList");
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
//设置角色确定按钮
const handleSetRole = async () => {
  let res;
  if (props.title === "分配角色") {
    res = await setRoles(form.value.id, selectValue.value);
  }
  if (res) {
    ElMessage({
      message: i18n.t("message.addSuccess"),
      type: "success",
    });
    emits("getUserList");
    handleClose();
  } else {
    ElMessage({
      message: i18n.t("message.addFailed"),
      type: "error",
    });
  }
};
</script>

<style lang="scss" scoped></style>
