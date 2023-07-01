<template>
  <div class="user">
    <div class="header">
      <el-input v-model="form.userName" class="input" @change="getList" clearable placeholder="请输入用户名称" />
      <el-button type="primary" @click="showDialog('add')">新增</el-button>
    </div>
    <div class="center" ref="centerRef">
      <el-divider />
      <el-table :border="true" :height="tableHeight" stripe :data="list">
        <el-table-column prop="username" label="用户名称" />
        <el-table-column label="创建时间" >
          <template #default="scope">
            {{useFormatDate(scope.row.created)}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" >
          <template #default="scope">
            {{useFormatDate(scope.row.updated)}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click.stop="showDialog('password', toRaw(scope.row))">修改密码</el-button>
            <el-button size="small" type="warning" @click.stop="showDialog('bindrole', toRaw(scope.row))">编辑角色</el-button>
            <el-button size="small" type="danger" @click.stop="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination :page-sizes="[10, 20, 30, 40]" background layout="prev, pager, next, sizes, total"
        :total="form.total" />
    </div>
  </div>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="currentCom.title" @close="close" align-center>
    <component ref="childRef" :is="currentCom.component" @dialogBackFn="dialogBackFn"></component>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import { markRaw, nextTick, onMounted, reactive, ref, toRaw } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Add from '@/views/User/Add/index.vue';
import Password from '@/views/User/Password/index.vue';
import BindRole from '@/views/User/BindRole/index.vue';
import { useFormatDate } from '@/hooks/index'

const list = ref([]);
const centerRef = ref<HTMLElement>();
const tableHeight = ref<number>();
const dialogVisible = ref<boolean>(false);
const childRef = ref();
const form = reactive({
  userName: '',
  pageNumber: 1,
  pageSize: 20,
  total: 0
});
const currentCom = reactive<any>({
  title: '',
  component: null
});

onMounted(() => {
  getList();
  let height = centerRef.value?.clientHeight;
  tableHeight.value = height ? height - 20 : 0;
});

// dialog回调函数
const dialogBackFn = () => {
  dialogVisible.value = false;
  getList();
};

// 删除
const deleteItem = (id: number) => {
  ElMessageBox.confirm(
    '确定要删除此项吗？',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  )
    .then(async () => {
      let res = await Axios.post('/user/delete', { id });
      if (res.status == 0) {
        ElMessage.success("删除成功!");
        getList();
      } else {
        ElMessage.error(res.message);
      }
    }).catch(e => console.log(e));
};

// 提交
const confirm = () => {
  childRef.value.submit();
};

// 关闭弹框
const close = () => {
  dialogVisible.value = false;
};

// 显示弹出框
const showDialog = (type: string, info?: any) => {
  dialogVisible.value = true;
  nextTick(() => {
    // 绑定操作时的id
    if (childRef.value.dialogForm.id !== undefined) {
      childRef.value.dialogForm.id = info.id;
    }
  });
  switch (type) {
    case "add":
      currentCom.component = markRaw(Add);
      currentCom.title = "新增用户";
      break;
    case "password":
      currentCom.component = markRaw(Password);
      currentCom.title = "修改密码";
      break;
    default:
      currentCom.component = markRaw(BindRole);
      currentCom.title = "编辑角色";
      nextTick(() => {
        // 添加默认roles
        childRef.value.dialogForm.roles.push(...info.roles);
      });
      break;
  }
};

// 获取用户列表
const getList = async () => {
  let { data, total } = await Axios.post('/user/list', toRaw(form));
  list.value = data;
  form.total = total;
};

</script>

<style lang="scss" scoped>
.user {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 40px;

    .input {
      width: 200px;
      margin-right: 15px;
    }
  }

  .center {
    flex: 1;
  }

  .footer {
    padding: 10px 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: end;
  }
}
</style>