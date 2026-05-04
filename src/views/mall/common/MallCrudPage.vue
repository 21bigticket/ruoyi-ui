<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      v-show="showSearch"
      :label-width="queryLabelWidth"
    >
      <template v-for="field in queryFields">
        <el-form-item :key="field.prop" :label="field.label" :prop="field.prop">
          <el-input
            v-if="!field.type || field.type === 'input'"
            v-model="queryParams[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            clearable
            @keyup.enter.native="handleQuery"
          />
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="queryParams[field.prop]"
            controls-position="right"
            :min="field.min !== undefined ? field.min : 0"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="queryParams[field.prop]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            clearable
          >
            <el-option
              v-for="option in field.options || []"
              :key="`${field.prop}-${option.value}`"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="addPermi"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="editPermi"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="removePermi"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="rows" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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
            class="mall-crud-image"
          />
          <span v-else>{{ formatValue(resolveValue(scope.row, column), column) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="editPermi"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="removePermi"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" :width="dialogWidth" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
        <template v-for="field in formFields">
          <el-form-item :key="field.prop" :label="field.label" :prop="field.prop">
            <el-input
              v-if="!field.type || field.type === 'input'"
              v-model="form[field.prop]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="isEdit && field.readonlyOnEdit"
            />
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="form[field.prop]"
              type="textarea"
              :rows="field.rows || 3"
              :placeholder="field.placeholder || `请输入${field.label}`"
            />
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="form[field.prop]"
              controls-position="right"
              :min="field.min !== undefined ? field.min : 0"
            />
            <el-radio-group v-else-if="field.type === 'radio'" v-model="form[field.prop]">
              <el-radio
                v-for="option in field.options || []"
                :key="`${field.prop}-${option.value}`"
                :label="option.value"
              >{{ option.label }}</el-radio>
            </el-radio-group>
            <el-select
              v-else-if="field.type === 'select'"
              v-model="form[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              clearable
            >
              <el-option
                v-for="option in field.options || []"
                :key="`${field.prop}-${option.value}`"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi"

export default {
  name: "MallCrudPage",
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    queryFields: {
      type: Array,
      default: () => []
    },
    formFields: {
      type: Array,
      default: () => []
    },
    defaultQuery: {
      type: Object,
      default: () => ({})
    },
    defaultForm: {
      type: Object,
      default: () => ({})
    },
    fetchList: {
      type: Function,
      required: true
    },
    fetchDetail: {
      type: Function,
      required: true
    },
    createItem: {
      type: Function,
      required: true
    },
    updateItem: {
      type: Function,
      required: true
    },
    deleteItem: {
      type: Function,
      required: true
    },
    permissionPrefix: {
      type: String,
      required: true
    },
    addPermissions: {
      type: Array,
      default: () => []
    },
    editPermissions: {
      type: Array,
      default: () => []
    },
    removePermissions: {
      type: Array,
      default: () => []
    },
    entityLabel: {
      type: String,
      required: true
    },
    idProp: {
      type: String,
      default: "id"
    },
    normalizer: {
      type: Function,
      default: null
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    dialogWidth: {
      type: String,
      default: "560px"
    },
    formLabelWidth: {
      type: String,
      default: "100px"
    },
    queryLabelWidth: {
      type: String,
      default: "88px"
    }
  },
  data() {
    return {
      loading: false,
      rows: [],
      total: 0,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      open: false,
      title: "",
      form: this.createForm(),
      queryParams: this.createQueryParams()
    }
  },
  computed: {
    isEdit() {
      return this.form[this.idProp] !== undefined && this.form[this.idProp] !== null
    },
    addPermi() {
      return this.addPermissions && this.addPermissions.length ? this.addPermissions : [`${this.permissionPrefix}:add`]
    },
    editPermi() {
      return this.editPermissions && this.editPermissions.length ? this.editPermissions : [`${this.permissionPrefix}:edit`]
    },
    removePermi() {
      return this.removePermissions && this.removePermissions.length ? this.removePermissions : [`${this.permissionPrefix}:remove`]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    createQueryParams() {
      return Object.assign({ pageNum: 1, pageSize: 10 }, this.clone(this.defaultQuery))
    },
    createForm() {
      return this.clone(this.defaultForm)
    },
    clone(value) {
      return JSON.parse(JSON.stringify(value || {}))
    },
    getList() {
      this.loading = true
      this.fetchList({ ...this.queryParams }).then(response => {
        const rows = Array.isArray(response?.rows) ? response.rows : []
        this.rows = this.normalizer ? rows.map(item => this.normalizer(item)) : rows
        this.total = Number(response?.total || 0)
      }).catch(() => {
        this.rows = []
        this.total = 0
      }).finally(() => {
        this.loading = false
      })
    },
    reset() {
      this.form = this.createForm()
      this.resetForm("form")
    },
    cancel() {
      this.open = false
      this.reset()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.queryParams = this.createQueryParams()
      this.getList()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item[this.idProp])
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = `添加${this.entityLabel}`
    },
    handleUpdate(row) {
      this.reset()
      const id = row ? row[this.idProp] : this.ids[0]
      this.fetchDetail(id).then(response => {
        const data = response?.data || {}
        this.form = this.normalizer ? this.normalizer(data) : data
        this.open = true
        this.title = `修改${this.entityLabel}`
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        const request = this.isEdit ? this.updateItem(this.form) : this.createItem(this.form)
        request.then(() => {
          this.$modal.msgSuccess(this.isEdit ? "修改成功" : "新增成功")
          this.open = false
          this.getList()
        })
      })
    },
    handleDelete(row) {
      const ids = row ? [row[this.idProp]] : this.ids
      this.$modal.confirm(`是否确认删除${this.entityLabel}编号为"${ids.join(",")}"的数据项？`).then(() => {
        return Promise.all(ids.map(id => this.deleteItem(id)))
      }).then(() => {
        this.$modal.msgSuccess("删除成功")
        this.getList()
      }).catch(() => {})
    },
    resolveValue(row, column) {
      if (typeof column.formatter === "function") {
        return column.formatter(row)
      }
      return this.resolvePath(row, column.prop)
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
    formatValue(value, column) {
      if (value === undefined || value === null || value === "") {
        return "-"
      }
      if (column.type === "time") {
        return parseTime(value)
      }
      if (column.type === "money") {
        const amount = Number(value)
        return Number.isNaN(amount) ? value : `¥${(amount / 100).toFixed(2)}`
      }
      return value
    }
  }
}
</script>

<style scoped>
.mall-crud-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
</style>
