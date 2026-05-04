<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="售后单号" prop="salesNo">
        <el-input v-model="queryParams.salesNo" placeholder="请输入售后单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input-number v-model="queryParams.userId" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="售后状态" prop="salesStatus">
        <el-select v-model="queryParams.salesStatus" placeholder="请选择状态" clearable>
          <el-option v-for="item in salesStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="salesList">
      <el-table-column label="售后ID" align="center" prop="salesId" width="100" />
      <el-table-column label="售后单号" align="center" prop="salesNo" min-width="180" />
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="180" />
      <el-table-column label="用户ID" align="center" prop="userId" width="100" />
      <el-table-column label="售后类型" align="center" prop="salesType" width="100">
        <template slot-scope="scope">{{ resolveSalesType(scope.row.salesType) }}</template>
      </el-table-column>
      <el-table-column label="退款金额" align="center" prop="refundAmount" width="120">
        <template slot-scope="scope">{{ formatMoney(scope.row.refundAmount) }}</template>
      </el-table-column>
      <el-table-column label="售后状态" align="center" prop="salesStatus" width="100">
        <template slot-scope="scope">
          <el-tag :type="resolveStatusType(scope.row.salesStatus)">{{ resolveSalesStatus(scope.row.salesStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-check"
            v-hasPermi="['mall:afterSales:audit']"
            :disabled="scope.row.salesStatus !== 0"
            @click="openAuditDialog(scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-money"
            :disabled="scope.row.salesStatus !== 1 && scope.row.salesStatus !== 3"
            @click="handleRefund(scope.row)"
          >退款</el-button>
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

    <el-dialog title="售后详情" :visible.sync="detailOpen" width="920px" append-to-body>
      <el-descriptions v-if="detail.salesNo" :column="2" border>
        <el-descriptions-item label="售后单号">{{ detail.salesNo }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
        <el-descriptions-item label="售后状态">{{ resolveSalesStatus(detail.salesStatus) }}</el-descriptions-item>
        <el-descriptions-item label="售后类型">{{ resolveSalesType(detail.salesType) }}</el-descriptions-item>
        <el-descriptions-item label="退款金额">{{ formatMoney(detail.refundAmount) }}</el-descriptions-item>
        <el-descriptions-item label="审核备注">{{ detail.auditRemark || "-" }}</el-descriptions-item>
        <el-descriptions-item label="售后说明">{{ detail.salesDesc || "-" }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">售后商品</el-divider>
      <el-table :data="detailItems">
        <el-table-column label="订单项ID" align="center" prop="orderItemId" width="120" />
        <el-table-column label="SKU ID" align="center" prop="skuId" width="100" />
        <el-table-column label="SKU名称" align="center" prop="skuName" min-width="180" />
        <el-table-column label="数量" align="center" prop="quantity" width="90" />
        <el-table-column label="退款金额" align="center" prop="refundAmount" width="120">
          <template slot-scope="scope">{{ formatMoney(scope.row.refundAmount) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="售后审核" :visible.sync="auditOpen" width="520px" append-to-body>
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="88px">
        <el-form-item label="售后单号">
          <el-input v-model="auditForm.salesNo" disabled />
        </el-form-item>
        <el-form-item label="审核结果" prop="auditStatus">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemark">
          <el-input v-model="auditForm.auditRemark" type="textarea" :rows="3" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">确 定</el-button>
        <el-button @click="auditOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAfterSales, getAfterSales, auditAfterSales, refundAfterSales } from "@/api/mall/order/afterSales"

const salesStatusMap = {
  0: { label: "待审核", type: "info" },
  1: { label: "审核通过", type: "success" },
  2: { label: "审核拒绝", type: "danger" },
  3: { label: "退款中", type: "warning" },
  4: { label: "退款完成", type: "success" },
  5: { label: "已关闭", type: "info" }
}

const salesTypeMap = {
  1: "退款",
  2: "退货",
  3: "换货"
}

export default {
  name: "MallAfterSalesManage",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      salesList: [],
      detailOpen: false,
      auditOpen: false,
      detail: {},
      detailItems: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        salesNo: undefined,
        orderNo: undefined,
        userId: undefined,
        salesStatus: undefined,
        dateRange: []
      },
      auditForm: {
        salesNo: "",
        auditStatus: 1,
        auditRemark: ""
      },
      auditRules: {
        auditStatus: [{ required: true, message: "审核结果不能为空", trigger: "change" }],
        auditRemark: [{ required: true, message: "审核备注不能为空", trigger: "blur" }]
      },
      salesStatusOptions: [
        { label: "待审核", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "审核拒绝", value: 2 },
        { label: "退款中", value: 3 },
        { label: "退款完成", value: 4 },
        { label: "已关闭", value: 5 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listAfterSales(this.queryParams).then(response => {
        this.salesList = (response.rows || []).map(this.normalizeSales)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeSales(row) {
      if (!row) return {}
      return {
        salesId: row.salesId ?? row.sales_id,
        salesNo: row.salesNo ?? row.sales_no,
        orderNo: row.orderNo ?? row.order_no,
        userId: row.userId ?? row.user_id,
        salesType: row.salesType ?? row.sales_type,
        salesReason: row.salesReason ?? row.sales_reason,
        salesDesc: row.salesDesc ?? row.sales_desc,
        refundAmount: row.refundAmount ?? row.refund_amount,
        salesStatus: row.salesStatus ?? row.sales_status,
        auditRemark: row.auditRemark ?? row.audit_remark,
        createTime: row.createTime ?? row.create_time
      }
    },
    normalizeSalesItem(row) {
      return {
        orderItemId: row.orderItemId ?? row.order_item_id,
        skuId: row.skuId ?? row.sku_id,
        skuName: row.skuName ?? row.sku_name,
        quantity: row.quantity,
        refundAmount: row.refundAmount ?? row.refund_amount
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
        salesNo: undefined,
        orderNo: undefined,
        userId: undefined,
        salesStatus: undefined,
        dateRange: []
      }
      this.getList()
    },
    handleDetail(row) {
      getAfterSales({ salesNo: row.salesNo }).then(response => {
        this.detail = this.normalizeSales(response.data)
        this.detailItems = (response.items || []).map(this.normalizeSalesItem)
        this.detailOpen = true
      })
    },
    openAuditDialog(row) {
      this.auditForm = {
        salesNo: row.salesNo,
        auditStatus: 1,
        auditRemark: ""
      }
      this.auditOpen = true
    },
    submitAudit() {
      this.$refs.auditForm.validate(valid => {
        if (!valid) return
        auditAfterSales(this.auditForm).then(() => {
          this.$modal.msgSuccess("审核成功")
          this.auditOpen = false
          this.getList()
        })
      })
    },
    handleRefund(row) {
      this.$modal.confirm(`确认触发售后单 "${row.salesNo}" 的退款流程吗？`).then(() => {
        return refundAfterSales(row.salesNo)
      }).then(() => {
        this.$modal.msgSuccess("退款流程已触发")
        this.getList()
      }).catch(() => {})
    },
    resolveSalesStatus(status) {
      return salesStatusMap[status]?.label || status
    },
    resolveStatusType(status) {
      return salesStatusMap[status]?.type || "info"
    },
    resolveSalesType(type) {
      return salesTypeMap[type] || type
    },
    formatMoney(value) {
      return `¥${(Number(value || 0) / 100).toFixed(2)}`
    }
  }
}
</script>
