<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center @close="close">
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
        <el-col :span="12">
          <el-form-item label="菜单分配">
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
        <el-col :span="12">
          <el-form-item label="权限分配">
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
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import type { FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { ElMessage } from 'element-plus';

type Props = {
  title: string;
  item: any;
};
const props = defineProps<Props>();
const dialogVisible = ref<boolean>(true);
const formRef = ref<FormInstance>();
const dialogForm = ref<{
  name: string;
  description: string;
  menu: any[];
  permission: any[];
}>({
  name: '',
  description: '',
  menu: [],
  permission: [],
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称!', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
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
const permission = ref();
const menuRef = ref();
const permissionRef = ref();

// 获取权限列表
const getPermissionList = async () => {
  let { data } = await Axios.post('/permission/list', {
    permissionName: '',
    pageNumber: 1,
    pageSize: 2000,
    total: 0,
  });
  permission.value = data;
};

// 获取菜单列表
const getMenuList = async () => {
  let { data } = await Axios.post('/menu/list', {
    menuName: '',
    pageNumber: 1,
    pageSize: 2000,
    total: 0,
  });
  data.map((item: any) => {
    if (item.title == '首页') {
      item.disabled = true;
    }
  });
  menu.value = data;
};

// 提交
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      dialogForm.value.menu = [...menuRef.value!.getCheckedKeys(), ...menuRef.value!.getHalfCheckedKeys()];
      dialogForm.value.permission = [
        ...permissionRef.value!.getCheckedKeys(),
        ...permissionRef.value!.getHalfCheckedKeys(),
      ];
      if (dialogForm.value.menu.length && dialogForm.value.permission.length) {
        if (props.title == '新增角色') {
          let res = await Axios.post('/role/add', toRaw(dialogForm.value));
          if (res.status == 0) {
            ElMessage.success(res.message);
            close(true);
          } else {
            ElMessage.error(res.message);
          }
        } else {
          let res = await Axios.post('/role/edit', toRaw(dialogForm.value));
          if (res.status == 0) {
            ElMessage.success(res.message);
            close(true);
          } else {
            ElMessage.error(res.message);
          }
        }
      } else {
        ElMessage.warning('请选择菜单、权限分配');
      }
    } else {
      return false;
    }
  });
};

// 关闭
const close = (flag = false) => {
  dialogVisible.value = false;
  emits('close', flag);
};

const emits = defineEmits(['close', 'dialogBackFn']);

onMounted(async () => {
  await getPermissionList();
  await getMenuList();
  if (props.title == '编辑角色') {
    dialogForm.value = props.item;
    toRaw(props.item.menu).map((item: number) => {
      menuRef.value!.setChecked(item, true, false);
    });
    toRaw(props.item.permission).map((item: number) => {
      permissionRef.value!.setChecked(item, true, false);
    });
  } else {
    menuRef.value!.setChecked(1, true, false);
  }
});
</script>

<style lang="scss" scoped>
.el-form--label-top .el-form-item {
  margin-right: 40px;
}
</style>
