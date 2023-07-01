<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" @close="close" align-center>
    <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
      <el-form-item prop="parentid" label="父级id">
        <el-input size="large" :disabled="true" placeholder="请输入父级id" v-model="dialogForm.parentid" />
      </el-form-item>
      <el-form-item prop="title" label="名称">
        <el-input size="large" v-model="dialogForm.title" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item prop="icon" label="图标">
        <el-input size="large" v-model="dialogForm.icon" placeholder="请输入图标" />
      </el-form-item>
      <el-form-item label="组件">
        <el-input size="large" v-model="dialogForm.component" placeholder="请输入组件名" />
      </el-form-item>
      <el-form-item prop="router" label="链接地址">
        <el-input size="large" v-model="dialogForm.router" placeholder="请输入链接地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { onMounted, reactive, ref, toRaw } from 'vue';

type Props = {
  title: string,
  item: any
}
const props = defineProps<Props>();
const dialogVisible = ref<boolean>(true);
const dialogForm = ref({
  title: '',
  icon: '',
  router: '',
  component: '',
  parentid: null,
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [
    { required: true, message: "请输入名称", trigger: 'blur' },
  ],
  icon: [
    { required: true, message: "请输入图标", trigger: 'blur' },
  ],
  router: [
    { required: true, message: "请输入链接地址", trigger: 'blur' },
  ],
  component: [
    { required: true, message: "请输入组件名", trigger: 'blur' },
  ],
  parentid: [
    { required: true, message: "请输入父级id", trigger: 'blur' },
  ]
});

// 提交 
const submit = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      if (props.title == "新增菜单") {
        let res = await Axios.post("/menu/add", toRaw(dialogForm.value));
        if (res.status == 0) {
          ElMessage.success(res.message);
          close();
        } else {
          ElMessage.error(res.message);
        }
      } else {
        let res = await Axios.post("/menu/edit", toRaw(dialogForm.value));
        if (res.status == 0) {
          ElMessage.success(res.message);
          close(true);
        } else {
          ElMessage.error(res.message);
        }
      }
    } else {
      return false;
    }
  });
}

// 关闭
const close = (flag = false) => {
  dialogVisible.value = false;
  emits("close", flag);
};

const emits = defineEmits(["close"]);

onMounted(() => {
  if (props.title == "新增菜单") {
    dialogForm.value.parentid = props.item;
  } else {
    dialogForm.value = props.item;
  }
});


</script>

<style lang="scss" scoped>

</style>