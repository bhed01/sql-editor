<template>
  <el-container>
    <side-nav
      :disable-save="disableSave"
      :disable-run="disableRun"
      @save="onSave"
      @run="onRun"
      @open-tab="openTab"
      :is-collapse="isSidenavCollapse"
    />
    <el-container direction="vertical">
      <tabbar
        :tabs="tabs"
        :current="currentTabID"
        @tab-click="updateCurrent"
        @edit="editTab"
      />
      <query-result :success="success" :data="result" :msg="errMsg" />
    </el-container>
  </el-container>
</template>

<script>
import Tabbar from "@/components/Tabbar.vue";
import QueryResult from "@/components/QueryResult.vue";
import SideNav from "@/components/SideNav.vue";

import fakexios from "@/fakexios";
import { getAccessToken } from "@/utils/auth";
import { getTab } from "@/utils";

import { reactive, toRefs, computed, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

export default {
  name: "Editor",
  setup() {
    const route = useRoute();
    const state = reactive({
      tabs: [],
      currentTabID: null,
      success: null,
      result: {},
      errMsg: "abd",
    });

    //function to open new tab
    const openTab = (tabData) => {
      if (!tabData) {
        tabData = {
          title: "New Query",
          id: `Q${state.tabs.length + 1}`,
          content: "",
          modified: true,
        };
        state.tabs.push(tabData);
        state.currentTabID = tabData.id;
      } else {
        tabData.then((res) => {
          if (!getTab(state.tabs, res.id)) {
            state.tabs.push(res);
          }
          state.currentTabID = res.id;
        });
      }
    };

    //function to update current tab id
    const updateCurrent = (t) => {
      state.currentTabID = t.paneName;
    };

    //to open and close tabs
    const editTab = (targetID, action) => {
      if (action === "add") {
        openTab();
      } else if (action === "remove") {
        if (state.currentTabID === targetID) {
          state.tabs.forEach((tab, index) => {
            if (tab.id === targetID) {
              let nextTab = state.tabs[index + 1] || state.tabs[index - 1];
              state.currentTabID = nextTab && nextTab.id;
            }
          });
        }
        state.tabs = state.tabs.filter((tab) => tab.id !== targetID);
      }
    };

    //to controll save button
    const disableSave = computed(() => {
      return (
        !state.currentTabID ||
        state.currentTabID[0] === "T" ||
        !getTab(state.tabs, state.currentTabID).modified
      );
    });
    const onSave = () => {
      getTab(state.tabs, state.currentTabID).modified = false;
    };

    //to controll run button
    const disableRun = computed(() => {
      return !state.currentTabID || state.currentTabID[0] === "T";
    });
    const onRun = () => {
      if (!disableRun._value) {
        const params = {
          code: getTab(state.tabs, state.currentTabID).content,
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        };
        fakexios
          .post(`/database/${route.params.id}/query`, params)
          .then(({ data }) => {
            (state.success = data.success),
              (state.result = {
                data: data.result || [],
                columns: Object.keys((data.result && data.result[0]) || []),
              });
            state.errMsg = data.msg;
          })
          .catch((res) => {
            ElMessage({
              showClose: true,
              message: "Something went wrong!",
              type: "error",
            });
          });
      }
    };

    //close tabs on route change
    watchEffect(() => {
      if (!route.params.id);
      (state.tabs = []),
        (state.currentTabID = null),
        (state.output = {
          success: null,
          result: {},
          msg: "",
        });
    });

    return {
      ...toRefs(state),
      openTab,
      editTab,
      updateCurrent,
      disableSave,
      disableRun,
      onSave,
      onRun,
    };
  },
  props: {
    isSidenavCollapse: Boolean,
    id: String,
  },
  components: {
    Tabbar,
    QueryResult,
    SideNav,
  },
};
</script>