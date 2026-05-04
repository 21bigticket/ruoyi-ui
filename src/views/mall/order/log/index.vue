<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="操作类型" prop="action">
        <el-select v-model="queryParams.action" placeholder="请选择操作类型" clearable>
          <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="openCreateDialog">新增日志</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="logList">
      <el-table-column label="日志ID" align="center" prop="logId" width="100" />
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="180">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="goOrder(scope.row)">{{ scope.row.orderNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" align="center" prop="action" width="120" />
      <el-table-column label="操作人" align="center" prop="operator" width="120" />
      <el-table-column label="操作数据" align="center" prop="actionData" min-width="260" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showPayload(scope.row)">查看数据</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-truck" @click="goDelivery(scope.row)">物流</el-button>
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

    <el-dialog title="新增订单日志" :visible.sync="createOpen" width="560px" append-to-body>
      <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="88px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="createForm.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="操作类型" prop="action">
          <el-select v-model="createForm.action" placeholder="请选择操作类型">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="createForm.operator" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="操作数据" prop="actionData">
          <el-input v-model="createForm.actionData" type="textarea" :rows="4" placeholder="请输入 JSON 或说明文本" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCreate">确 定</el-button>
        <el-button @click="createOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="操作数据" :visible.sync="payloadOpen" width="760px" append-to-body>
      <pre class="payload-box">{{ payloadContent }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import { listOrderLog, addOrderLog } from "@/api/mall/order/orderLog"

export default {
  name: "MallOrderLogManage",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      logList: [],
      createOpen: false,
      payloadOpen: false,
      payloadContent: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: this.$route.query.orderNo || undefined,
        action: this.$route.query.action || undefined,
        dateRange: []
      },
      createForm: {
        orderNo: "",
        action: "",
        operator: "admin",
        actionData: ""
      },
      createRules: {
        orderNo: [{ required: true, message: "订单号不能为空", trigger: "blur" }],
        action: [{ required: true, message: "操作类型不能为空", trigger: "change" }],
        operator: [{ required: true, message: "操作人不能为空", trigger: "blur" }]
      },
      actionOptions: [
        { label: "创建", value: "create" },
        { label: "支付", value: "pay" },
        { label: "取消", value: "cancel" },
        { label: "完成", value: "finish" },
        { label: "退款", value: "refund" },
        { label: "发货", value: "deliver" }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listOrderLog(this.queryParams).then(response => {
        this.logList = (response.rows || []).map(this.normalizeLog)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeLog(row) {
      if (!row) return {}
      return {
        logId: row.logId ?? row.log_id,
        orderNo: row.orderNo ?? row.order_no,
        action: row.action,
        actionData: row.actionData ?? row.action_data,
        operator: row.operator,
        createTime: row.createTime ?? row.create_time
      }
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
        orderNo: undefined,
        action: undefined,
        dateRange: []
      }
      this.getList()
    },
    openCreateDialog() {
      this.createForm = {
        orderNo: this.queryParams.orderNo || "",
        action: "",
        operator: "admin",
        actionData: ""
      }
      this.createOpen = true
    },
    submitCreate() {
      this.$refs.createForm.validate(valid => {
        if (!valid) return
        addOrderLog(this.createForm).then(() => {
          this.$modal.msgSuccess("订单日志新增成功")
          this.createOpen = false
          this.getList()
        })
      })
    },
    showPayload(row) {
      this.payloadContent = row.actionData || "-"
      this.payloadOpen = true
    },
    goOrder(row) {
      this.$router.push({
        path: "/mall/order/order",
        query: { orderNo: row.orderNo }
      })
    },
    goDelivery(row) {
      this.$router.push({
        path: "/mall/order/delivery",
        query: { orderNo: row.orderNo }
      })
    }
  }
}
</script>

<style scoped>
.payload-box {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  max-height: 420px;
  overflow: auto;
}
</style>
