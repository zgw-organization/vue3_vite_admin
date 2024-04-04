<template>
  <div class="role">
    <div class="header">
      <el-input v-model="form.roleName" class="input" clearable placeholder="请输入角色名称" @change="getListHandler" />
      <el-button type="primary" @click="addOrEditHandler('add')">新增</el-button>
    </div>
    <div ref="centerRef" class="center">
      <el-table :border="true" :height="tableHeight" stripe :data="listData">
        <el-table-column prop="name" label="名称" :align="'center'" />
        <el-table-column prop="description" label="描述" :align="'center'" />
        <el-table-column label="创建时间" :align="'center'">
          <template #default="scope">
            {{ useFormatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" :align="'center'">
          <template #default="scope">
            {{ useFormatDate(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'">
          <template #default="scope">
            <el-button size="small" type="warning" @click.stop="addOrEditHandler('edit', scope.row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click.stop="deleteItemHandler(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="prev, pager, next, sizes, total"
        :total="form.total"
        @size-change="paginationSizeChangeHandler"
        @current-change="paginationCurrentChangeHandler"
      />
    </div>
  </div>
  <Edit v-if="flag" :title="title" :item="editData" @close="dialogCloseCallback"></Edit>
</template>

<script lang="ts" setup>
import Edit from './Edit/index.vue';
import { useFormatDate } from '@/hooks/commons';
import { deleteRole, getRoleById, getRoleList } from '@/api';

const listData = ref([]);
const tableHeight = ref<number>();
const centerRef = ref<HTMLElement>();
const form = reactive({
  roleName: '',
  pageNumber: 1,
  pageSize: 20,
  total: 0,
});
// dialog
const flag = ref<boolean>(false);
const title = ref<string>('');
const editData = ref<any>();

onMounted(() => {
  getListHandler();
  let height = centerRef.value?.clientHeight;
  tableHeight.value = height ? height - 20 : 0;
});

// add / edit
const addOrEditHandler = async (value: string, id?: number) => {
  title.value = value;
  if (id) {
    let { data } = await getRoleById(id);
    editData.value = data;
  } else {
    editData.value = null;
  }
  flag.value = true;
};

// deleted
const deleteItemHandler = (id: number) => {
  ElMessageBox.alert('确定要删除此项吗？', '删除', {
    confirmButtonText: '确定',
    type: 'error',
  }).then(async () => {
    let { code, message } = await deleteRole({ ids: [id] });
    if (code == 200) {
      ElMessage.success('删除成功!');
      getListHandler();
    } else {
      ElMessage.error(message);
    }
  });
};

// pagination pagesize change
const paginationSizeChangeHandler = (pageSize: number) => {
  form.pageSize = pageSize;
  getListHandler();
};

// pagination current change
const paginationCurrentChangeHandler = (currentPage: number) => {
  form.pageNumber = currentPage;
  getListHandler();
};

// dialog close callback
const dialogCloseCallback = (f: boolean) => {
  flag.value = false;
  if (!f) return;
  getListHandler();
};

// get role list
const getListHandler = async () => {
  let {
    data: { list, total },
  } = await getRoleList(toRaw(form));
  listData.value = list;
  form.total = total;
};

// options
defineOptions({
  name: 'Role',
});
</script>

<style lang="scss" scoped>
.role {
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
    padding: 10px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: end;
  }
}
</style>
