<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center @close="closeHandler">
    <el-form ref="formRef" :rules="rules" label-position="top" size="large" :model="dialogForm">
      <el-row>
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="dialogForm.name" size="large" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="dialogForm.description" size="large" placeholder="请输入描述" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="菜单分配：">
            <el-tree
              ref="menuRef"
              :data="menu"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :props="menuProps"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="权限分配：">
            <el-tree
              ref="permissionRef"
              :data="permission"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :props="permissionProps"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import { addRole, editRole, getMenuList, getPermissionList } from '@/api';

// props
const props = defineProps<{
  title: string;
  item: any;
}>();

// dialog
const dialogVisible = ref<boolean>(true);

// ref
const formRef = ref<FormInstance>();

// form
const dialogForm = ref<{
  id?: number;
  name: string;
  description: string;
  menus: any[];
  permissions: any[];
}>({
  name: '',
  description: '',
  menus: [],
  permissions: [],
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称!', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述!', trigger: 'blur' }],
});

// tree
const permissionProps = {
  children: 'children',
  label: 'alias',
};
const menuProps = {
  children: 'children',
  label: 'title',
  disabled: 'disabled',
};
const menu = ref();
const menuRef = ref();
const permission = ref();
const permissionRef = ref();

onMounted(async () => {
  await getPermissionListHandler();
  await getMenuListHandler();
  if (props.title == 'edit') {
    const data = props.item;
    dialogForm.value = data;
    data.menus.map((item: { id: number }) => {
      menuRef.value!.setChecked(item.id, true, false);
    });
    data.permissions.map((item: { id: number }) => {
      permissionRef.value!.setChecked(item.id, true, false);
    });
  }
});

// get permission list
const getPermissionListHandler = async () => {
  let { data } = await getPermissionList();
  permission.value = data;
};

// get menu list
const getMenuListHandler = async () => {
  let { data } = await getMenuList();
  menu.value = data;
};

// submit
const submitHandler = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      dialogForm.value.menus = [...menuRef.value!.getCheckedKeys(), ...menuRef.value!.getHalfCheckedKeys()];
      dialogForm.value.permissions = [
        ...permissionRef.value!.getCheckedKeys(),
        ...permissionRef.value!.getHalfCheckedKeys(),
      ];
      if (dialogForm.value.menus.length && dialogForm.value.permissions.length) {
        const { success, message } = await (props.title == 'add' ? addRole : editRole)(toRaw(dialogForm.value));
        ElMessage[success ? 'success' : 'error'](success ? (props.title == 'add' ? '新增成功' : '编辑成功') : message);
        closeHandler(true);
      } else {
        ElMessage.error('请选择菜单、权限分配');
      }
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

<style lang="scss" scoped>
.el-form--label-top .el-form-item {
  margin-right: 40px;
}
</style>
