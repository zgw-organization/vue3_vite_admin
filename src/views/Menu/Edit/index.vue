<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center @close="closeHandler">
    <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
      <el-form-item prop="parentId" label="父级id">
        <el-input v-model="dialogForm.parentId" size="large" :disabled="true" placeholder="请输入父级id" />
      </el-form-item>
      <el-form-item prop="title" label="名称">
        <el-input v-model="dialogForm.title" size="large" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item prop="icon" label="图标">
        <el-input v-model="dialogForm.icon" size="large" placeholder="请输入图标" />
      </el-form-item>
      <el-form-item prop="path" label="URL">
        <el-input v-model="dialogForm.path" size="large" placeholder="请输入URL" />
      </el-form-item>
      <el-form-item prop="component" label="组件名">
        <el-input v-model="dialogForm.component" size="large" placeholder="请输入组件名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandler">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { addMenu, editMenu } from '@/api';
import { type FormInstance, type FormRules } from 'element-plus';

// props
const props = defineProps<{
  title: string;
  item: any;
}>();

// dialog
const dialogVisible = ref<boolean>(true);
const dialogForm = ref({
  title: '',
  icon: '',
  path: '',
  component: '',
  parentId: null,
});
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
  path: [{ required: true, message: '请输入URL', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件', trigger: 'blur' }],
  parentId: [{ required: true, message: '请输入父级id', trigger: 'blur' }],
});

// ref
const formRef = ref<FormInstance>();

onMounted(() => {
  const data = props.item;
  if (props.title === 'add') {
    dialogForm.value.parentId = data ? data.id : 0;
  } else {
    data.parentId = data.parentId ? data.parentId : 0;
    dialogForm.value = data;
  }
});

const title = computed(() => {
  if (props.title == 'add') {
    return '新增菜单';
  } else {
    return '编辑菜单';
  }
});

// submit
const submitHandler = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const { message, success } = await (props.title == 'add' ? addMenu : editMenu)(toRaw(dialogForm.value));
      ElMessage[success ? 'success' : 'error'](success ? (props.title == 'add' ? '新增成功' : '编辑成功') : message);
      closeHandler(true);
    } else {
      return false;
    }
  });
};

// close
const closeHandler = (flag = false) => {
  dialogVisible.value = false;
  emits('close', flag);
};

// emits
const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped></style>
