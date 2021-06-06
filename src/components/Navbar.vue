<template>
  <el-header class="nav">
    <div class="nav__start">
      <button
        v-if="!isSidenavCollapse"
        class="nav__element"
        @click="$emit('toggleSideNav')"
      >
        <i class="nav__icon el-icon-s-fold" />
      </button>
      <button v-else class="nav__element" @click="$emit('toggleSideNav')">
        <i class="nav__icon el-icon-s-unfold" />
      </button>
      <router-link class="nav__brand" :to="{ name: 'Home' }">
        SQL Editor
      </router-link>
      <el-menu mode="horizontal">
        <el-submenu index="1">
          <template #title>Open Database</template>
          <el-menu-item
            v-for="db in databases"
            :key="db.id"
            :index="`1-${db.id}`"
            @click="openDatabase(db.id)"
          >
            {{ db.name }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item width="200px" @click="setPopupVisible(true)" index="2">
          Create Database
        </el-menu-item>

        <el-dialog title="Enter Database Name" v-model="isPopupVisible">
          <el-input
            autofocus
            @keydown.enter="onConfirm"
            v-model="dbName"
            autocomplete="off"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="setPopupVisible(false)">Cancel</el-button>
              <el-button type="primary" @click="onConfirm">Confirm</el-button>
            </span>
          </template>
        </el-dialog>
      </el-menu>
    </div>
    <div class="nav__end">
      <el-dropdown class="nav__element" trigger="click">
        <span class="el-dropdown-link">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onLogout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import fakexios from "@/fakexios";
import { getAccessToken, logout } from "@/utils/auth";

import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import {
  ElMessage,
  ElAvatar,
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElHeader,
} from "element-plus";

export default {
  setup() {
    const router = useRouter();
    const params = {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    };

    const state = reactive({
      databases: [],
      isPopupVisible: false,
      dbName: "",
    });

    fakexios
      .get("/database", params)
      .then((res) => {
        state.databases = res.data;
      })
      .catch((res) => {
        console.log(res);
      });

    const openDatabase = (db_id) => {
      router.push({ name: "Editor", params: { id: db_id } });
    };

    const onLogout = () => {
      logout();
      router.push({ name: "Login" });
    };

    const setPopupVisible = (val) => {
      state.isPopupVisible = val;
    };

    const onConfirm = () => {
      if (!!state.dbName.trim()) {
        fakexios
          .post("/database", { name: state.dbName, ...params })
          .then((res) => {
            state.databases.push(res.data);
            setPopupVisible(false);
            router.push({ name: "Editor", params: { id: res.data.id } });
          })
          .catch((e) => {
            console.log(e);
            ElMessage({
              showClose: true,
              message: "Something went wrong!",
              type: "error",
            });
          });
      }
    };

    return {
      ...toRefs(state),
      openDatabase,
      onLogout,
      setPopupVisible,
      onConfirm,
    };
  },
  props: {
    isSidenavCollapse: Boolean,
  },
  components: {
    ElAvatar,
    ElDialog,
    ElDropdownMenu,
    ElDropdown,
    ElDropdownItem,
    ElHeader,
  },
};
</script>

<style lang="scss" >
.nav {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #e6e6e6;
  &__start {
    display: flex;
    align-items: center;
  }
  &__element {
    background: none;
    border: none;
    padding: 4px;
    margin: 6px;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
    }
  }
  &__icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__brand {
    text-decoration: none;
    color: inherit;
    font-weight: bold;
    font-size: 1.2rem;
    display: inline-block;
    padding: 0 1rem;
  }
}
.el-avatar {
  display: block;
}
.el-menu {
  &-item {
    overflow-y: hidden;
  }
  &-item.is-active {
    border: none !important;
  }
}
</style>