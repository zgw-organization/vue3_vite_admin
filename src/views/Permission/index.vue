<template>
  <div class="permission">
    <div class="header">
      <el-input v-model="form.permissionName" class="input" clearable placeholder="请输入权限名称" @change="getList" />
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <div ref="centerRef" class="center">
      <el-table
        highlight-current-row
        :height="tableHeight"
        stripe
        row-key="id"
        :border="true"
        default-expand-all
        :data="list"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="alias" label="别名" />
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ useFormatDate(scope.row.created) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template #default="scope">
            {{ useFormatDate(scope.row.updated) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="warning" @click.stop="editItem(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click.stop="deleteItem(scope.row.id)">删除</el-button>
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
      />
    </div>
  </div>
  <Edit v-if="flag" :title="title" :item="currentItem" @close="close"></Edit>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import { ElMessageBox, ElMessage } from 'element-plus';
import { onMounted, reactive, ref, toRaw } from 'vue';
import Edit from './Edit/index.vue';
import { useFormatDate } from '@/hooks/commons';

const list = ref([]);
const currentRow = ref();
const tableHeight = ref<number>();
const centerRef = ref<HTMLElement>();
const form = reactive({
  permissionName: '',
  pageNumber: 1,
  pageSize: 20,
  total: 0,
});
// dialog
const flag = ref<boolean>(false);
const title = ref<string>('新增权限');
const currentItem = ref<any>();

// 新增
const add = () => {
  currentItem.value = currentRow.value ? currentRow.value.id : 0;
  flag.value = true;
  title.value = '新增权限';
};

// 编辑
const editItem = (item: any) => {
  currentItem.value = item;
  flag.value = true;
  title.value = '编辑权限';
};

// 弹窗关闭回调
const close = (f: boolean) => {
  flag.value = false;
  if (!f) return;
  getList();
};

// 当前行改变
const handleCurrentChange = (val: any) => {
  currentRow.value = val;
};

// 删除
const deleteItem = (id: number) => {
  ElMessageBox.confirm('确定要删除此项吗？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error',
  }).then(async () => {
    let res = await Axios.post('/permission/delete', { id });
    if (res.status == 0) {
      ElMessage.success('删除成功!');
      getList();
    } else {
      ElMessage.error(res.message);
    }
  });
};

// 获取权限列表
const getList = async () => {
  let { data, total } = await Axios.post('/permission/list', toRaw(form));
  list.value = data;
  form.total = total;
};

onMounted(() => {
  getList();
  let height = centerRef.value?.clientHeight;
  tableHeight.value = height ? height - 20 : 0;
});
</script>

<script lang="ts">
export default {
  name: 'Permission',
};
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
    padding: 10px 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: end;
  }
}
</style>
