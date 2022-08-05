<template>
  <div class="login-container">
    <el-form :model="form" class="login-form" :rules="rules" ref="ruleFromRef">
      <div class="title-container">
        <h3 class="title">{{ $t("login.title") }}</h3>
      </div>
      <el-form-item prop="username">
        <el-icon :size="20" class="svg-container"> <User /> </el-icon>
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-icon :size="20" class="svg-container"> <Lock /> </el-icon>
        <el-input v-model="form.password" :type="passwordType" />
        <!-- 密文显示密码 -->
        <el-icon
          v-if="passwordType === 'password'"
          :size="20"
          class="show-pwd"
          @click="changeType"
        >
          <Hide />
        </el-icon>
        <!-- 密文显示密码 -->
        <!-- 明文显示密码 -->
        <el-icon
          v-if="passwordType === 'text'"
          :size="20"
          class="show-pwd"
          @click="changeType"
        >
          <View />
        </el-icon>
        <!-- 明文显示密码 -->
      </el-form-item>
      <!-- 登陆按钮 -->
      <el-button
        type="primary"
        class="login-button"
        @click="handleLogin(ruleFromRef)"
        >{{ $t("login.btnTitle") }}</el-button
      >
      <!-- 登陆按钮 -->
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { UserFilled, User, Lock, View, Hide } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();

const form = ref({
  username: "admin",
  password: "123456",
});
//接收ref选择DOM
const ruleFromRef = ref<FormInstance>();
//表单验证规则
const rules = ref<FormRules>({
  username: [
    { required: true, message: "Please input username", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
  ],
});
//明文显示密码按钮
const passwordType = ref("password");
const changeType = () => {
  if (passwordType.value === "password") {
    passwordType.value = "text";
  } else {
    passwordType.value = "password";
  }
};
//登录按钮点击事件
const handleLogin = async (ruleFromRef: FormInstance | undefined) => {
  if (!ruleFromRef) return;
  await ruleFromRef.validate(async (valid, fields) => {
    if (valid) {
      tokenStore.login(form.value);
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    ::v-deep .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    ::v-deep .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      .el-input__wrapper {
        width: 100%;
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        height: 47px;
        box-shadow: 0 0 0 0;
        caret-color: $cursor;
      }
      .el-input__inner {
        color: $light_gray;
      }
    }
    .login-button {
      width: 100%;
      box-sizing: border-box;
    }
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    overflow: hidden;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
