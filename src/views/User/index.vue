<template>
  <div class="user">
    <div class="header">
      <el-input v-model="form.userName" class="input" clearable placeholder="请输入用户名称" @change="getList" />
      <el-button type="primary">新增</el-button>
    </div>
    <div ref="centerRef" class="center">
      <!-- <el-divider /> -->
      <el-table :border="true" :height="tableHeight" stripe :data="listData">
        <el-table-column prop="name" label="用户名称" :align="'center'" />
        <el-table-column prop="email" label="邮箱" :align="'center'" />
        <el-table-column label="角色" :align="'center'">
          <template #default="scope">
            {{ scope.row.roles.map((item: any) => item.name).join(',') }}
          </template>
        </el-table-column>
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
            <el-button size="small" type="warning">编辑角色</el-button>
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
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useFormatDate } from '@/hooks/commons';
import { getUserList } from '@/api';

const listData = ref([]);
const centerRef = ref<HTMLElement>();
const tableHeight = ref<number>();
const form = reactive({
  userName: '',
  pageNumber: 1,
  pageSize: 20,
  total: 0,
});

onMounted(() => {
  getList();
  let height = centerRef.value?.clientHeight;
  tableHeight.value = height ? height - 20 : 0;
});

// 删除
const deleteItem = (id: number) => {
  ElMessageBox.alert('确定要删除此项吗？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error',
  })
    .then(async () => {
      let res = await Axios.post('/user/delete', { id });
      if (res.status == 0) {
        ElMessage.success('删除成功!');
        getList();
      } else {
        ElMessage.error(res.message);
      }
    })
    .catch((e) => console.log(e));
};

// 获取用户列表
const getList = async () => {
  let {
    data: { list, total },
  } = await getUserList(toRaw(form));
  listData.value = list;
  form.total = total;
};
</script>

<script lang="ts">
export default {
  name: 'User',
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
