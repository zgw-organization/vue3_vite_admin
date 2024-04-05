<template>
  <div class="permission">
    <div class="header">
      <el-input v-model="form.menuName" class="input" clearable placeholder="请输入菜单名称" @change="getListHandler" />
      <el-button type="primary" @click="addOrEditHandler('add')">新增</el-button>
    </div>
    <div ref="centerRef" class="center">
      <el-table
        highlight-current-row
        :height="tableHeight"
        stripe
        row-key="id"
        :border="true"
        default-expand-all
        :data="listData"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="icon" label="图标" :align="'center'" />
        <el-table-column prop="path" label="URL" :align="'center'" />
        <el-table-column prop="component" label="组件名" :align="'center'" />
        <el-table-column label="创建时间" :align="'center'">
          <template #default="scope">
            {{ useFormatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" :align="'center'">
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
  <Edit v-if="flag" :title="title" :item="editData" @close="close"></Edit>
</template>

<script lang="ts" setup>
import { useFormatDate } from '@/hooks/commons';
import { deleteMenu, getMenuById, getMenuList } from '@/api';
import Edit from './Edit/index.vue';

// table
const listData = ref([]);
const tableHeight = ref<number>();
const centerRef = ref<HTMLElement>();
const selectedRow = ref<any>(null);

// form
const form = reactive({
  menuName: '',
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

// selected row
const handleCurrentChange = (currentRow: any) => {
  selectedRow.value = currentRow;
};

// add / edit
const addOrEditHandler = async (value: string, id?: number) => {
  title.value = value;
  if (id) {
    let { data } = await getMenuById(id);
    editData.value = data;
  } else {
    editData.value = selectedRow.value ? toRaw(selectedRow.value) : null;
  }
  flag.value = true;
};

const paginationSizeChangeHandler = (pageSize: number) => {
  form.pageSize = pageSize;
  getListHandler();
};

// pagination current change
const paginationCurrentChangeHandler = (currentPage: number) => {
  form.pageNumber = currentPage;
  getListHandler();
};

// close
const close = (f: boolean) => {
  flag.value = false;
  if (!f) return;
  getListHandler();
};

// deleted
const deleteItemHandler = (id: number) => {
  ElMessageBox.alert('确定要删除此项吗？', '删除', {
    confirmButtonText: '确定',
    type: 'error',
  })
    .then(async () => {
      let { code, message } = await deleteMenu({ ids: [id] });
      if (code == 200) {
        ElMessage.success('删除成功!');
        getListHandler();
      } else {
        ElMessage.error(message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// get menu list
const getListHandler = async () => {
  let {
    data: { list, total },
  } = await getMenuList(toRaw(form));
  listData.value = list;
  form.total = total;
};

// options
defineOptions({
  name: 'Menus',
});
</script>

<style lang="scss" scoped>
.permission {
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
