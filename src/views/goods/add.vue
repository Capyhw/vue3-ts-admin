<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        <span>添加商品</span>
      </div>
    </template>
    <el-steps :active="activeName * 1" align-center>
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-tabs
        tab-position="left"
        stretch
        v-model="activeName"
        :before-leave="(n:string, o:string) => tabChange(n, o, ruleFormRef)"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="ruleForm.goods_name" />
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model.number="ruleForm.goods_price" type="number" />
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model.number="ruleForm.goods_number" type="number" />
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model.number="ruleForm.goods_weight" type="number" />
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              :options="categoryList"
              :props="casProps"
              clearable
              v-model="setOptions"
              popper-class="cascader-popper"
              @change="getGoodsCat"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-button
            type="primary"
            size="default"
            @click="addSort"
            :disabled="setOptions === null || setOptions.length === 0"
            >添加商品参数
          </el-button>

          <template v-for="(item, index) in manyTableData" :key="item.attr_id">
            <el-divider content-position="left">{{
              item.attr_name
            }}</el-divider>
            <el-select
              v-model="paramsSelect[index]"
              clearable
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="(item2, index2) in item.attr_vals.split(',')"
                :key="index2"
                :label="item2"
                :value="{ attr_value: item2, attr_id: item.attr_id }"
              />
            </el-select>
          </template>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form ref="ruleFormRef" :model="ruleForm3" label-width="150px">
            <el-button
              type="primary"
              size="default"
              @click="addSort"
              :disabled="setOptions === null || setOptions.length === 0"
              >添加参数
            </el-button>
            <template
              v-for="(item, index) in onlyTableData"
              :key="item.attr_id"
            >
              <el-form-item :label="item.attr_name" prop="goods_name">
                <el-input v-model="item.attr_vals" />
              </el-form-item>
            </template>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://101.43.228.147:7854/api/private/v1/upload"
            :headers="headers"
            multiple
            auto-upload
            list-type="picture-card"
            ref="uploadRef"
            :on-success="handleSuccess"
          >
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <el-icon><Download /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="remove(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible2">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <textarea v-model="goods_introduce"></textarea>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >Submit
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
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
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import type { FormInstance } from "element-plus";
import { getGoodsList } from "@/api/category.js";
import { getParamsList } from "@/api/params.js";
import Dialog from "./components/Dialog.vue";
import type { UploadFile, UploadProps, UploadInstance } from "element-plus";
import { add } from "@/api/goods.js";
import { useRouter } from "vue-router";
const router = useRouter();
const activeName = ref(0);
//切换tab
const tabChange = (n: string, o: string, formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (ruleForm.goods_cat === "") {
    ElMessage({
      showClose: true,
      message: "请填写完整信息",
      type: "error",
    });
    return false;
  }
  return formEl.validate((valid) => {
    if (valid) {
      if (n === "1") {
        getParams("many");
      }
      if (n === "2") {
        getParams("only");
      }
    } else {
      ElMessage({
        showClose: true,
        message: "请填写完整信息",
        type: "error",
      });
      return false;
    }
  });
};
const ruleFormRef = ref<FormInstance>();
//商品名称规则
const validateName = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入商品名称"));
  } else {
    callback();
  }
};
//商品价格规则
const validatePrice = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入商品价格"));
  } else {
    callback();
  }
};
//商品数量规则
const validateNumber = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入商品数量"));
  } else {
    callback();
  }
};
//商品重量规则
const validateWeight = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入商品重量"));
  } else {
    callback();
  }
};

//第一个tab的表单
const ruleForm = reactive({
  goods_name: "",
  goods_price: "",
  goods_number: "",
  goods_weight: "",
  goods_cat: "",
});
//校验规则
const rules = reactive({
  goods_name: [{ validator: validateName, trigger: "blur" }],
  goods_price: [{ validator: validatePrice, trigger: "blur" }],
  goods_number: [{ validator: validateNumber, trigger: "blur" }],
  goods_weight: [{ validator: validateWeight, trigger: "blur" }],
});
//级联选择器配置
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
};
//保存分类列表
const getGoodsCat = () => {
  // console.log(setOptions.value); //数组
  if (setOptions.value !== null) {
    if (setOptions.value.length === 3) {
      ruleForm.goods_cat = setOptions.value.join(",");
    } else {
      setOptions.value = [];
    }
  } else {
    ruleForm.goods_cat = "";
  }
};
//-------第二个tab
//动态参数表格数据
const manyTableData = ref([]);
//获取参数列表
const getParams = async (set: string) => {
  //分类id
  uid.value = setOptions.value[2];
  const res = await getParamsList(setOptions.value[2], set);
  if (set === "many") {
    manyTableData.value = res;
  } else {
    onlyTableData.value = res;
  }
};
//商品参数页面选择器值
const paramsSelect = ref([]);

//添加动态/静态参数dialog-start
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
//添加参数
const addSort = () => {
  dialogVisible.value = true;
  //清空表单
  info.value = {
    attr_name: "",
    attr_vals: "",
    attr_sel: "",
  };
  if (activeName.value == 1) {
    title.value = "添加动态参数";
    info.value.attr_sel = "many";
  } else if (activeName.value == 2) {
    title.value = "添加静态参数";
    info.value.attr_sel = "only";
  }
};
//添加动态/静态参数dialog-end

//-------第三个tab商品属性
//静态参数表格数据
const onlyTableData = ref([]);
//第三个tab的表单
const ruleForm3 = reactive({
  goods_name: "",
  goods_price: "",
  goods_number: "",
  goods_weight: "",
  goods_cat: "",
});
//对onlyTableData处理得到attrs属性值
const tempOnly = ref<any[]>([]);
watch(
  () => onlyTableData,
  (val) => {
    tempOnly.value = val.value.map((item) => {
      return {
        attr_id: item.attr_id,
        attr_value: item.attr_vals,
      };
    });
  },
  { immediate: true, deep: true }
);
//------------------第四个tab商品图片
const dialogImageUrl = ref("");
const dialogVisible2 = ref(false);
const disabled = ref(false);
const uploadRef = ref<UploadInstance>();
const headers = ref({
  Authorization: localStorage.getItem("token"),
});
//需要提交的pic
const picList = ref<{ pic: string }[]>([]);

//上传成功
const handleSuccess = (res: any) => {
  const obj = {
    pic: res.data.tmp_path as string,
  };
  picList.value.push(obj);
  // console.log(picList.value);
};
const remove = (file: UploadFile) => {
  uploadRef.value?.handleRemove(file);
  //在picList中删除对应的图片
  const i = picList.value.findIndex(
    (x) => x.pic === file.response.data.tmp_path
  );
  if (i !== -1) {
    picList.value.splice(i, 1);
  }
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible2.value = true;
};

const handleDownload = (file: UploadFile) => {
  console.log(file);
};
//------------------第五个tab商品内容
const goods_introduce = ref("");
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let attrs = [];
      attrs = paramsSelect.value.concat(tempOnly.value);
      let formData = {
        goods_name: ruleForm.goods_name,
        goods_price: ruleForm.goods_price,
        goods_number: ruleForm.goods_number,
        goods_weight: ruleForm.goods_weight,
        goods_cat: ruleForm.goods_cat,
        goods_introduce: goods_introduce.value,
        attrs: attrs,
        pics: picList.value,
      };
      const res = await add(formData);
      router.push("/goods");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  //获取商品分类列表
  getCategoryList();
});
</script>

<style lang="scss" scoped>
.el-tabs {
  margin-top: 20px;
}
.el-button {
  margin-bottom: 5px;
}
</style>
