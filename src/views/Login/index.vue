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
        <el-button type="primary" class="btn" size="large" :loading="loading" @click="login">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { userLogin } from '@/api';
import { setToken } from '@/utils/token';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

// 使用插件loading
// const instance = getCurrentInstance();
// instance?.proxy?.$loading.show();

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({
  username: 'admin',
  password: '123456',
});
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名!', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码!', trigger: 'blur' }],
});

// 登录
const login = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      loading.value = true;
      const { status, token } = await userLogin(toRaw(form));
      if (status === 0) {
        ElMessage.success('登录成功');
        // 设置token
        setToken(token);
        router.push('/home');
      } else {
        ElMessage.error('用户名密码错误!');
      }
      loading.value = false;
    } else {
      ElMessage.error('请输入用户名密码!');
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
