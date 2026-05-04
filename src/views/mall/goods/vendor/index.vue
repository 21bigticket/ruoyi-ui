<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入供应商名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['mall:vendor:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['mall:vendor:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['mall:vendor:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="vendorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="供应商ID" align="center" prop="id" width="100" />
      <el-table-column label="供应商编码" align="center" prop="code" min-width="140" />
      <el-table-column label="供应商名称" align="center" prop="name" min-width="160" />
      <el-table-column label="联系人" align="center" prop="contact" width="120" />
      <el-table-column label="手机号" align="center" prop="phone" min-width="140" />
      <el-table-column label="邮箱" align="center" prop="email" min-width="180" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="210">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['mall:vendor:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-goods" @click="goGoods(scope.row)">商品</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['mall:vendor:remove']">删除</el-button>
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

    <el-dialog :title="title" :visible.sync="open" width="620px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="供应商编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入供应商编码" :disabled="form.id !== undefined" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="3" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item v-if="form.id !== undefined" label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listVendor, getVendor, addVendor, updateVendor, delVendor } from "@/api/mall/goods/vendor"

export default {
  name: "MallVendor",
  data() {
    const phoneValidator = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      if (!/^[0-9+\-() ]{6,20}$/.test(value)) {
        callback(new Error("手机号格式不正确"))
        return
      }
      callback()
    }
    return {
      loading: false,
      showSearch: true,
      total: 0,
      vendorList: [],
      ids: [],
      single: true,
      multiple: true,
      open: false,
      title: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined
      },
      form: {},
      rules: {
        code: [{ required: true, message: "供应商编码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "供应商名称不能为空", trigger: "blur" }],
        phone: [{ validator: phoneValidator, trigger: "blur" }],
        email: [{ type: "email", message: "邮箱格式不正确", trigger: ["blur", "change"] }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listVendor(this.queryParams).then(response => {
        this.vendorList = (response.rows || []).map(this.normalizeVendor)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeVendor(row) {
      if (!row) return {}
      return {
        id: row.id,
        code: row.code,
        name: row.name,
        contact: row.contact,
        phone: row.phone,
        email: row.email,
        address: row.address,
        status: row.status,
        createTime: row.createTime ?? row.create_time,
        updateTime: row.updateTime ?? row.update_time
      }
    },
    reset() {
      this.form = {
        id: undefined,
        code: "",
        name: "",
        contact: "",
        phone: "",
        email: "",
        address: "",
        status: 1
      }
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined
      }
      this.getList()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "新增供应商"
    },
    handleUpdate(row) {
      const id = row?.id || this.ids[0]
      this.reset()
      getVendor(id).then(response => {
        this.form = this.normalizeVendor(response.data)
        this.open = true
        this.title = "修改供应商"
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const request = this.form.id !== undefined ? updateVendor(this.form) : addVendor(this.form)
        request.then(() => {
          this.$modal.msgSuccess(this.form.id !== undefined ? "修改成功" : "新增成功")
          this.open = false
          this.getList()
        })
      })
    },
    handleDelete(row) {
      const ids = row?.id ? [row.id] : this.ids
      this.$modal.confirm(`是否确认删除供应商编号为"${ids.join(",")}"的数据项？`).then(() => {
        return Promise.all(ids.map(id => delVendor(id)))
      }).then(() => {
        this.$modal.msgSuccess("删除成功")
        this.getList()
      }).catch(() => {})
    },
    goGoods(row) {
      this.$router.push({
        path: "/mall/goods/goods",
        query: { vendorId: row.id }
      })
    }
  }
}
</script>
