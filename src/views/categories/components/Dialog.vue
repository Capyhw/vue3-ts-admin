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
        <el-form-item
          label="父级分类"
          prop="cat_level"
          v-if="title === '添加分类'"
        >
          <el-cascader
            :options="categoryList"
            :props="casProps"
            clearable
            v-model="setOptions"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(formRef)">取消</el-button>
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
import { getGoodsList, addCategory, editCategory } from "@/api/category.js";

const i18n = useI18n();
//info的类型
type IUser = {
  cat_pid: number;
  cat_name: string;
  cat_level: number;
  cat_id?: number;
};
const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  info: IUser;
}>();
const emits = defineEmits(["update:dialogVisible", "getCategoryList"]);
const formRef = ref<FormInstance>();
const form = ref<IUser>({
  cat_pid: 0,
  cat_name: "",
  cat_level: 0,
});

//uid
const uid = ref(0);
//级联选择器
const casProps = {
  label: "cat_name",
  value: "cat_id",
  children: "children",
  checkStrictly: true,
};
//表单验证规则
const rules = reactive<FormRules>({
  cat_name: [
    { required: true, message: "Please input cat_name", trigger: "blur" },
    // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  cat_level: [
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
      cat_id: val.cat_id,
      cat_pid: val.cat_pid,
      cat_name: val.cat_name,
      cat_level: val.cat_level || 0,
    };
    uid.value = val.cat_pid || 0;
  },
  { immediate: true, deep: true }
);
//商品分类列表
const categoryList = ref([]);
//级联选择器选择的值
const setOptions = ref([]);
//请求参数
const query = ref({
  type: 2,
});

//获取商品分类列表
const getCategoryList = async () => {
  const res = await getGoodsList(query.value);
  console.log(res);
  categoryList.value = res;
};
//级联选择器change
const handleChange = (val: any) => {
  if (setOptions.value !== null) {
    form.value.cat_pid = setOptions.value[setOptions.value.length - 1];
    form.value.cat_level = setOptions.value.length;
  } else {
    form.value.cat_pid = 0;
    form.value.cat_level = 0;
  }
  console.log(form.value);
};
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  setOptions.value = [];

  emits("update:dialogVisible", false);
};
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const res =
        props.title === "添加分类"
          ? await addCategory(form.value)
          : await editCategory(form.value.cat_id, form.value.cat_name);
      if (res) {
        ElMessage({
          message: i18n.t("message.addSuccess"),
          type: "success",
        });
        getCategoryList();
        emits("getCategoryList");
        handleClose(formEl);
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
  getCategoryList();
});
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
