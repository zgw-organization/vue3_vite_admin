<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center @close="closeHandler">
    <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
      <el-form-item prop="name" label="用户名">
        <el-input v-model="dialogForm.name" size="large" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item v-if="!dialogForm.id" prop="password" label="密码">
        <el-input v-model="dialogForm.password" size="large" type="password" show-password placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="dialogForm.email" size="large" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select
          v-model="dialogForm.roles"
          size="large"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择角色"
        >
          <template v-for="i in roleList" :key="i.value">
            <el-option :label="i.label" :value="i.value" />
          </template>
        </el-select>
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
import type { FormInstance, FormRules } from 'element-plus';
import { addUser, editUser, getRoleSelect } from '@/api';

// props
const props = defineProps<{
  title: string;
  item: any;
}>();

// dialog
const dialogVisible = ref<boolean>(true);

// roleSelect
type RoleSelect = {
  value: number;
  label: string;
};
const roleList = ref<RoleSelect[]>();

// ref
const formRef = ref<FormInstance>();

// submit-form
const dialogForm = ref<{
  id?: number;
  name: string;
  password: string;
  email: string;
  roles: number[];
}>({
  name: '',
  password: '',
  email: '',
  roles: [],
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
});

onMounted(() => {
  getRoleSelectHandler();
  if (props.title == 'edit') {
    let data = props.item;
    data.roles = data.roles.map((item: any) => item.id);
    dialogForm.value = data;
  }
});

const title = computed(() => {
  if (props.title == 'add') {
    return '新增用户';
  } else {
    return '编辑用户';
  }
});

// close
const closeHandler = (flag = false) => {
  dialogVisible.value = false;
  emits('close', flag);
};

//get role select
const getRoleSelectHandler = async () => {
  let { data } = await getRoleSelect();
  roleList.value = data.map((item: any) => ({
    value: item.id,
    label: `${item.name}--${item.description}`,
  }));
};

// submit
const submitHandler = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const { success, message } = await (props.title == 'add' ? addUser : editUser)(toRaw(dialogForm.value));
      ElMessage[success ? 'success' : 'error'](success ? (props.title == 'add' ? '新增成功' : '编辑成功') : message);
      closeHandler(true);
    } else {
      return false;
    }
  });
};

// emits
const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped></style>
