<template>
  <div class="app-container">
    <el-form
      v-if="filters.length"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      v-show="showSearch"
      :label-width="labelWidth"
    >
      <template v-for="filter in filters">
        <el-form-item :key="filter.prop" :label="filter.label" :prop="filter.prop">
          <el-input
            v-if="!filter.type || filter.type === 'input'"
            v-model="queryParams[filter.prop]"
            :placeholder="filter.placeholder || `请输入${filter.label}`"
            clearable
            @keyup.enter.native="handleQuery"
          />
          <el-input-number
            v-else-if="filter.type === 'number'"
            v-model="queryParams[filter.prop]"
            controls-position="right"
            :min="filter.min !== undefined ? filter.min : 0"
            :placeholder="filter.placeholder"
          />
          <el-select
            v-else-if="filter.type === 'select'"
            v-model="queryParams[filter.prop]"
            :placeholder="filter.placeholder || `请选择${filter.label}`"
            clearable
          >
            <el-option
              v-for="option in filter.options || []"
              :key="`${filter.prop}-${option.value}`"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="filter.type === 'daterange'"
            v-model="queryParams[filter.prop]"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-alert
      v-if="notice"
      :title="notice"
      type="info"
      :closable="false"
      show-icon
      class="mall-page-alert"
    />

    <el-table v-loading="loading" :data="tableRows">
      <el-table-column
        v-for="column in columns"
        :key="column.prop || column.label"
        :label="column.label"
        :prop="column.prop"
        :align="column.align || 'center'"
        :width="column.width"
        :min-width="column.minWidth"
        :show-overflow-tooltip="column.showOverflowTooltip !== false"
      >
        <template slot-scope="scope">
          <el-tag v-if="column.type === 'tag'" :type="resolveTagType(column, scope.row)">
            {{ resolveTagLabel(column, scope.row) }}
          </el-tag>
          <el-image
            v-else-if="column.type === 'image' && resolveValue(scope.row, column)"
            :src="resolveValue(scope.row, column)"
            fit="cover"
            class="mall-table-image"
          />
          <span v-else>{{ formatValue(resolveValue(scope.row, column), column) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="showPagination && total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi"

export default {
  name: "MallTablePage",
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    defaultQuery: {
      type: Object,
      default: () => ({})
    },
    fetchFn: {
      type: Function,
      required: true
    },
    filters: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: "88px"
    },
    notice: {
      type: String,
      default: ""
    },
    rowNormalizer: {
      type: Function,
      default: null
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      queryParams: this.createQueryParams(),
      showSearch: true,
      tableRows: [],
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    createQueryParams() {
      return Object.assign(
        {
          pageNum: 1,
          pageSize: 10
        },
        this.cloneValue(this.defaultQuery)
      )
    },
    cloneValue(value) {
      return JSON.parse(JSON.stringify(value || {}))
    },
    getList() {
      this.loading = true
      return this.fetchFn({ ...this.queryParams }).then(response => {
        const rows = Array.isArray(response?.rows) ? response.rows : []
        this.tableRows = this.rowNormalizer ? rows.map(item => this.rowNormalizer(item)) : rows
        this.total = Number(response?.total || 0)
      }).catch(() => {
        this.tableRows = []
        this.total = 0
      }).finally(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = this.createQueryParams()
      this.getList()
    },
    resolveValue(row, column) {
      if (typeof column.formatter === "function") {
        return column.formatter(row)
      }
      return this.resolvePath(row, column.prop)
    },
    resolveTagLabel(column, row) {
      const value = this.resolveValue(row, column)
      const option = (column.options || []).find(item => item.value === value)
      return option ? option.label : value
    },
    resolveTagType(column, row) {
      const value = this.resolveValue(row, column)
      const option = (column.options || []).find(item => item.value === value)
      return option ? option.type || "info" : "info"
    },
    resolvePath(target, path) {
      if (!target || !path) {
        return ""
      }
      return path.split(".").reduce((current, segment) => {
        if (current === undefined || current === null) {
          return undefined
        }
        const keys = this.createCandidateKeys(segment)
        const matchedKey = keys.find(key => Object.prototype.hasOwnProperty.call(current, key))
        return matchedKey ? current[matchedKey] : undefined
      }, target)
    },
    createCandidateKeys(segment) {
      const snake = segment.replace(/([A-Z])/g, "_$1").toLowerCase()
      const camel = segment.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
      return Array.from(new Set([segment, snake, camel]))
    },
    formatValue(value, column) {
      if (value === undefined || value === null || value === "") {
        return "-"
      }
      if (column.type === "time") {
        return parseTime(value)
      }
      if (column.type === "money") {
        return this.formatMoney(value)
      }
      if (column.type === "json") {
        return typeof value === "string" ? value : JSON.stringify(value)
      }
      return value
    },
    formatMoney(value) {
      const amount = Number(value)
      if (Number.isNaN(amount)) {
        return value
      }
      return `¥${(amount / 100).toFixed(2)}`
    }
  }
}
</script>

<style scoped>
.mall-page-alert {
  margin-bottom: 16px;
}

.mall-table-image {
  width: 42px;
  height: 42px;
  border-radius: 4px;
}
</style>
