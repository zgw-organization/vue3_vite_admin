<template>
  <div className="login">
    <el-card class="login-container">
      <el-form ref="formRef" :rules="rules" size="large" :model="form">
        <el-form-item prop="username">
          <el-input v-model="form.username" size="large" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" size="large" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item prop="code">
          <el-col :span="19">
            <el-input v-model="form.code" size="large" placeholder="请输入验证码" />
          </el-col>
          <el-col :span="5">
            <img :src="codeUrl" alt="" @click="resetCode" />
          </el-col>
        </el-form-item>
        <el-button type="primary" class="btn" size="large" :loading="loading" @click="userLogin">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/api';
import { setToken } from '@/utils/token';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

// 使用插件loading
// const instance = getCurrentInstance();
// instance?.proxy?.$Loading.show();

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({
  username: 'admin',
  password: '123456',
  code: '',
});
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名!', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码!', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码!', trigger: 'blur' }],
});
const host = import.meta.env.VITE_MODE === 'production' ? import.meta.env.VITE_BASE_URL : 'http://localhost:3300';
const codeUrl = ref(`${host}/api/v1/auth/code`);

// 重置验证码
const resetCode = () => {
  codeUrl.value = `${codeUrl.value}?${new Date().getTime()}`;
};

// 登录
const userLogin = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      loading.value = true;
      const { success, data, message } = await login(toRaw(form));
      if (success) {
        ElMessage.success('登录成功');
        // 设置token
        setToken(data.token);
        router.push('/home');
      } else {
        ElMessage.error(message);
      }
      loading.value = false;
    } else {
      ElMessage.error('请输入用户名密码!');
      return false;
    }
  });
};
</script>

<script lang="ts">
export default {
  name: 'Login',
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

  img {
    float: left;
    height: 100%;
    cursor: pointer;
  }

  &-container {
    width: 440px;
    height: 300px;
    padding-top: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    box-shadow: 0 0 50px rgb(0 0 0 / 10%);

    .btn {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
