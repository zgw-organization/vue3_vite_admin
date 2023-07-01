<template>
  <div className="login">
    <el-card class="login-container">
      <el-form :rules="rules" ref="formRef" size="large" :model="form">
        <el-form-item prop="username">
          <el-input size="large" placeholder="请输入用户名" v-model="form.username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-button type="primary" class="btn" size="large" @click="login">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { getCurrentInstance, reactive, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import Axios from '@/utils/http';
import { setToken } from '@/utils/token';

// 使用插件loading
// const instance = getCurrentInstance();
// instance?.proxy?.$loading.show();

const router = useRouter();
const formRef = ref<FormInstance>();
const form = reactive({
  username: 'admin',
  password: '123456'
});
const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名!", trigger: 'blur' },
  ],
  password: [
    { required: true, message: "请输入密码!", trigger: 'blur' },
  ]
});

// 登录
const login = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      const res = await Axios.post('/login', toRaw(form));
      if (res.status == 0) {
        ElMessage.success("登录成功");
        // 设置token
        setToken(res.token);
        router.push("/home");
      } else {
        ElMessage.error("用户名密码错误!");
      }
    } else {
      ElMessage.error("请输入用户名密码!");
      return false;
    }
  });
};



</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #2d3a4b;

  &-container {
    width: 440px;
    height: 220px;
    padding-top: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    box-shadow: 0 0 50px rgb(0 0 0 / 10%);

    .btn {
      width: 100%;
    }
  }
}
</style>