<template>
  <div class="app-container">
    <el-card shadow="never" class="message-summary">
      <div slot="header">
        <span>{{ title }}</span>
      </div>
      <div class="message-summary__body">
        <span>{{ description }}</span>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="message-tabs">
      <el-tab-pane label="模板管理" name="template">
        <mall-crud-page v-bind="templateConfig" />
      </el-tab-pane>
      <el-tab-pane label="发送记录" name="log">
        <mall-table-page
          :columns="logConfig.columns"
          :filters="logConfig.queryFields"
          :default-query="logConfig.defaultQuery"
          :fetch-fn="logConfig.listFn"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MallCrudPage from "@/views/mall/common/MallCrudPage"
import MallTablePage from "@/views/mall/common/MallTablePage"

export default {
  name: "MessageCenterPage",
  components: {
    MallCrudPage,
    MallTablePage
  },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    templateConfig: {
      type: Object,
      required: true
    },
    logConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: "template"
    }
  }
}
</script>

<style scoped>
.message-summary {
  margin-bottom: 16px;
}

.message-summary__body {
  color: #606266;
  line-height: 1.7;
}

.message-tabs :deep(.el-tabs__content) {
  overflow: visible;
}
</style>
