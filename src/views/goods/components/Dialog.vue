<template>
  <div>
    <el-dialog
      :model-value="dialogVisible"
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
        <el-form-item label="参数" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input
        ></el-form-item>
        <el-form-item label="参数值" prop="attr_vals">
          <el-input v-model="form.attr_vals"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose()">取消</el-button>
          <el-button type="primary" @click="handleConfirm(formRef)"
            >确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import { addParams, editParams } from "@/api/params.js";

const i18n = useI18n();
//info的类型
type ISORT = {
  attr_name: string;
  attr_vals?: string;
  attr_sel: string;
};
const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  info: ISORT;
  uid: number;
  pid: number;
}>();
const emits = defineEmits(["update:dialogVisible", "getParams"]);
const formRef = ref<FormInstance>();
const form = ref<ISORT>({
  attr_name: "",
  attr_vals: "",
  attr_sel: "",
});
//uid(分类id)
const uid = ref(0);
//pid(参数id)
const pid = ref(0);
//表单验证规则
const rules = reactive<FormRules>({
  attr_name: [
    { required: true, message: "Please input cat_name", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  attr_vals: [
    { required: false, message: "Please roleDesc", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});
//监测info
watch(
  () => props.info,
  (val: ISORT) => {
    //把info的值赋给form,uid
    form.value = {
      attr_name: val.attr_name,
      attr_vals: val.attr_vals,
      attr_sel: val.attr_sel,
    };
    uid.value = props.uid;
    pid.value = props.pid;
  },
  { immediate: true, deep: true }
);
//关闭弹窗
const handleClose = () => {
  form.value.attr_name = "";
  form.value.attr_vals = "";
  emits("update:dialogVisible", false);
};
//确认提交
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const res =
        props.title.indexOf("添加") !== -1
          ? await addParams(uid.value, form.value)
          : await editParams(uid.value, pid.value, form.value);
      if (res) {
        ElMessage({
          message: i18n.t("message.addSuccess"),
          type: "success",
        });
        if (props.title === "添加动态参数") emits("getParams", "many");
        else emits("getParams", "only");
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

onMounted(() => {
  // console.log(props);
});
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
