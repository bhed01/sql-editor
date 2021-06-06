<template>
  <div class="query-result">
    <el-table :data="data.data" height="calc(40vh - 60px)" style="width: 100%">
      <el-table-column
        v-for="column in data.columns"
        :prop="column"
        :label="column"
        :key="column"
      />
    </el-table>
  </div>
</template>

<script>
import { ElMessage, ElTable, ElTableColumn } from "element-plus";
import { onUpdated } from "vue";

export default {
  setup(props) {
    onUpdated(() => {
      if (props.success) {
        ElMessage({
          showClose: true,
          message: "Success",
          type: "success",
        });
      } else if (props.success === false) {
        ElMessage({
          showClose: true,
          message: props.msg,
          type: "error",
        });
      }
    });
  },
  props: {
    data: Object,
    msg: String,
    success: Boolean,
  },
  components: {
    ElTableColumn,
    ElTable,
  },
};
</script>

<style lang="scss">
.query-result {
  padding: 1rem;
  border-top: 1px solid #e6e6e6;
  height: calc(40vh - 60px);
  overflow-x: auto;
  scrollbar-color: #e6e6e6 transparent;
  &::-webkit-scrollbar {
    width: 6px;
    &-thumb {
      background-color: #c2c2c2;
    }
  }
}
</style>