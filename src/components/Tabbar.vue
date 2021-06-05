<template>
  <el-tabs v-model="current" type="card" editable>
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.id"
      :label="tab.title"
      :name="tab.id"
    >
      <prism-editor
        v-if="tab.id[0] === 'Q'"
        class="my-editor"
        v-model="tab.content"
        :highlight="highlighter"
        line-numbers
      />
      <el-table
        v-else
        height="calc(60vh - 121px)"
        :data="tab.content.data"
        style="width: 100%"
      >
        <el-table-column
          v-for="column in tab.content.columns"
          :prop="column"
          :label="column"
          :key="column"
        />
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";

import "highlight.js/styles/atom-one-light.css";
import "vue-prism-editor/dist/prismeditor.min.css";

hljs.registerLanguage("sql", sql);

export default {
  setup() {
    const highlighter = (code) => {
      return hljs.highlight(code, { language: "sql" }).value;
    };
    return {
      highlighter,
    };
  },
  props: {
    tabs: Object,
    current: String,
  },
  components: {
    PrismEditor,
  },
};
</script>

<style lang="scss">
.el-tabs {
  padding: 0.5rem;
  flex: 1;
  min-width: 0;
  &__content {
    padding: 0.5rem;
    height: calc(60vh - 121px);
    overflow: auto;
    scrollbar-color: #e6e6e6 transparent;
    &::-webkit-scrollbar {
      width: 6px;
      &-thumb {
        background-color: #c2c2c2;
      }
    }
  }
}
.my-editor {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.prism-editor {
  &__textarea:focus {
    outline: none;
  }
}
</style>