<template>
  <el-menu class="sidenav" unique-opened :collapse="isCollapse">
    <el-submenu :disabled="queries.length < 1" index="1">
      <template #title>
        <SQLIcon />
        <span>Queries</span>
      </template>
      <el-menu-item
        v-for="query in queries"
        @click="$emit('openTab', getQueryData(query.id))"
        :key="query.id"
        :index="`1-${query.id}`"
        >{{ query.name }}</el-menu-item
      >
    </el-submenu>
    <el-submenu :disabled="tables.length < 1" index="2">
      <template #title>
        <table-icon />
        <span>Tables</span>
      </template>
      <el-menu-item
        v-for="table in tables"
        @click="$emit('openTab', getTableData(table.id))"
        :key="table.id"
        :index="`2-${table.id}`"
        >{{ table.name }}</el-menu-item
      >
    </el-submenu>
    <el-menu-item @click="$emit('save')" :disabled="disableSave" index="3">
      <save-icon />
      <template #title>Save</template>
    </el-menu-item>
    <el-menu-item @click="$emit('run')" :disabled="disableRun" index="4">
      <i class="el-icon-caret-right"></i>
      <template #title>Run</template>
    </el-menu-item>
    <el-menu-item disabled index="5">
      <i class="el-icon-s-data"></i>
      <template #title>Plot</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import SQLIcon from "@/components/SQLIcon";
import TableIcon from "@/components/TableIcon";
import SaveIcon from "./SaveIcon.vue";

import fakexios from "@/fakexios";
import { getAccessToken } from "@/utils/auth";

import { reactive, watchEffect, toRefs } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  setup(_, { emit }) {
    const route = useRoute();
    const params = {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    };

    const db = reactive({
      tables: [],
      queries: [],
    });

    watchEffect(() => {
      if (!!route.params.id) {
        fakexios
          .get(`/database/${route.params.id}`, params)
          .then((res) => {
            db.tables = res.data.tables;
            db.queries = res.data.queries;
            if (!res.data.queries.length) {
              emit("openTab");
            }
          })
          .catch((res) => {
            ElMessage({
              showClose: true,
              message: "Something went wrong!",
              type: "error",
            });
          });
      } else {
        db.tables = [];
        db.queries = [];
      }
    });

    async function getQueryData(id) {
      const response = await fakexios.get(
        `/database/${route.params.id}/query/${id}`,
        params
      );
      return {
        title: response.data.name,
        id: "Q" + response.data.id,
        content: response.data.data,
        modified: false,
      };
    }

    async function getTableData(id) {
      const response = await fakexios.get(
        `/database/${route.params.id}/table/${id}`,
        params
      );
      return {
        title: response.data.name,
        id: "T" + response.data.id,
        content: {
          columns:
            !!response.data.data[0] && Object.keys(response.data.data[0]),
          data: response.data.data,
        },
      };
    }

    return {
      ...toRefs(db),
      getQueryData,
      getTableData,
    };
  },
  components: {
    SQLIcon,
    TableIcon,
    SaveIcon,
  },
  props: {
    isCollapse: Boolean,
    disableSave: Boolean,
    disableRun: Boolean,
  },
};
</script>

<style lang="scss">
.sidenav {
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 300px;
  scrollbar-color: #e6e6e6 transparent;
  &::-webkit-scrollbar {
    width: 6px;
    &-thumb {
      background-color: #c2c2c2;
    }
  }
  &:not(.el-menu--collapse) {
    min-width: 200px;
  }
}
.el-menu-item {
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>