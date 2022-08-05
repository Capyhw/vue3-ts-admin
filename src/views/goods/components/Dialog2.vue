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
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="form.goods_name"></el-input
        ></el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="goods_introduce">
          <el-input v-model="form.goods_introduce"></el-input>
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
import { update } from "@/api/goods.js";
const i18n = useI18n();
//info的类型
type ISORT = {
  goods_id: number;
  goods_name: string;
  goods_price: string;
  goods_weight: string;
  goods_number: string;
  goods_introduce: string;
};
const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  info: ISORT;
  pid: number;
}>();
const emits = defineEmits(["update:dialogVisible", "getGoodsList"]);
const formRef = ref<FormInstance>();
const form = ref<ISORT>({
  goods_id: 0,
  goods_name: "",
  goods_price: "",
  goods_weight: "",
  goods_number: "",
  goods_introduce: "",
});
//pid(参数id)
const pid = ref(0);
//表单验证规则
const rules = reactive<FormRules>({
  //   attr_name: [
  //     { required: true, message: "Please input cat_name", trigger: "blur" },
  //     // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  //   ],
  //   attr_vals: [
  //     { required: false, message: "Please roleDesc", trigger: "blur" },
  //     // { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  //   ],
});
//监测info
watch(
  () => props.info,
  (val: ISORT) => {
    //把info的值赋给form,uid
    form.value = {
      goods_id: val.goods_id,
      goods_name: val.goods_name,
      goods_price: val.goods_price,
      goods_weight: val.goods_weight,
      goods_number: val.goods_number,
      goods_introduce: val.goods_introduce,
    };
    pid.value = val.goods_id;
    console.log(pid.value);
  },
  { immediate: true, deep: true }
);
//关闭弹窗
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  emits("update:dialogVisible", false);
  formEl.resetFields();
};
//确认提交
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      console.log(pid.value);
      const res = await update(pid.value, form.value);
      if (res) {
        ElMessage({
          message: i18n.t("message.addSuccess"),
          type: "success",
        });
        emits("getGoodsList"); //触发父组件的getGoodsList方法
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
  console.log(props);
  pid.value = props.pid;
});
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
