<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="退款单号" prop="refundNo">
        <el-input v-model="queryParams.refundNo" placeholder="请输入退款单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="支付单号" prop="payNo">
        <el-input v-model="queryParams.payNo" placeholder="请输入支付单号" clearable />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable />
      </el-form-item>
      <el-form-item label="退款状态" prop="refundStatus">
        <el-select v-model="queryParams.refundStatus" placeholder="请选择状态" clearable>
          <el-option v-for="item in refundStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="退款时间">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['mall:refund:add']" @click="openCreateDialog">创建退款</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="refundList">
      <el-table-column label="退款ID" align="center" prop="refundId" width="100" />
      <el-table-column label="退款单号" align="center" prop="refundNo" min-width="180" />
      <el-table-column label="支付单号" align="center" prop="payNo" min-width="180" />
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="180" />
      <el-table-column label="退款金额" align="center" prop="refundAmount" width="120">
        <template slot-scope="scope">{{ formatMoney(scope.row.refundAmount) }}</template>
      </el-table-column>
      <el-table-column label="退款状态" align="center" prop="refundStatus" width="100">
        <template slot-scope="scope">
          <el-tag :type="resolveRefundType(scope.row.refundStatus)">{{ resolveRefundStatus(scope.row.refundStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="退款时间" align="center" prop="refundTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.refundTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
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

    <el-dialog title="退款详情" :visible.sync="detailOpen" width="860px" append-to-body>
      <el-descriptions v-if="detail.refundNo" :column="2" border>
        <el-descriptions-item label="退款单号">{{ detail.refundNo }}</el-descriptions-item>
        <el-descriptions-item label="支付单号">{{ detail.payNo }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="退款状态">{{ resolveRefundStatus(detail.refundStatus) }}</el-descriptions-item>
        <el-descriptions-item label="退款金额">{{ formatMoney(detail.refundAmount) }}</el-descriptions-item>
        <el-descriptions-item label="退款原因">{{ detail.refundReason || "-" }}</el-descriptions-item>
        <el-descriptions-item label="第三方流水">{{ detail.thirdPartyNo || "-" }}</el-descriptions-item>
        <el-descriptions-item label="退款时间">{{ parseTime(detail.refundTime) }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">退款明细</el-divider>
      <el-table :data="detailItems">
        <el-table-column label="明细ID" align="center" prop="itemId" width="100" />
        <el-table-column label="售后单号" align="center" prop="salesNo" min-width="180" />
        <el-table-column label="退款金额" align="center" prop="refundAmount" width="120">
          <template slot-scope="scope">{{ formatMoney(scope.row.refundAmount) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="创建退款" :visible.sync="createOpen" width="560px" append-to-body>
      <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="支付单号" prop="payNo">
          <el-input v-model="createForm.payNo" placeholder="请输入支付单号" />
        </el-form-item>
        <el-form-item label="售后单号" prop="salesNo">
          <el-input v-model="createForm.salesNo" placeholder="请输入售后单号" />
        </el-form-item>
        <el-form-item label="退款金额(分)" prop="refundAmount">
          <el-input-number v-model="createForm.refundAmount" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="退款原因" prop="refundReason">
          <el-input v-model="createForm.refundReason" type="textarea" :rows="3" placeholder="请输入退款原因" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCreate">确 定</el-button>
        <el-button @click="createOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRefund, getRefund, addRefund } from "@/api/mall/pay/payment"

const refundStatusMap = {
  0: { label: "退款中", type: "warning" },
  1: { label: "退款成功", type: "success" },
  2: { label: "退款失败", type: "danger" }
}

export default {
  name: "MallRefundManage",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      refundList: [],
      detailOpen: false,
      createOpen: false,
      detail: {},
      detailItems: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        refundNo: undefined,
        payNo: undefined,
        orderNo: undefined,
        refundStatus: undefined,
        dateRange: []
      },
      createForm: {
        payNo: "",
        salesNo: "",
        refundAmount: 1,
        refundReason: ""
      },
      createRules: {
        payNo: [{ required: true, message: "支付单号不能为空", trigger: "blur" }],
        salesNo: [{ required: true, message: "售后单号不能为空", trigger: "blur" }],
        refundAmount: [{ required: true, message: "退款金额不能为空", trigger: "blur" }],
        refundReason: [{ required: true, message: "退款原因不能为空", trigger: "blur" }]
      },
      refundStatusOptions: [
        { label: "退款中", value: 0 },
        { label: "退款成功", value: 1 },
        { label: "退款失败", value: 2 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listRefund(this.queryParams).then(response => {
        this.refundList = (response.rows || []).map(this.normalizeRefund)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeRefund(row) {
      if (!row) return {}
      return {
        refundId: row.refundId ?? row.refund_id,
        refundNo: row.refundNo ?? row.refund_no,
        payNo: row.payNo ?? row.pay_no,
        orderNo: row.orderNo ?? row.order_no,
        refundAmount: row.refundAmount ?? row.refund_amount,
        refundStatus: row.refundStatus ?? row.refund_status,
        thirdPartyNo: row.thirdPartyNo ?? row.third_party_no,
        refundTime: row.refundTime ?? row.refund_time,
        refundReason: row.refundReason ?? row.refund_reason
      }
    },
    normalizeRefundItem(row) {
      return {
        itemId: row.itemId ?? row.item_id,
        salesNo: row.salesNo ?? row.sales_no,
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
        refundNo: undefined,
        payNo: undefined,
        orderNo: undefined,
        refundStatus: undefined,
        dateRange: []
      }
      this.getList()
    },
    handleDetail(row) {
      getRefund({ refundNo: row.refundNo }).then(response => {
        this.detail = this.normalizeRefund(response.data)
        this.detailItems = (response.items || []).map(this.normalizeRefundItem)
        this.detailOpen = true
      })
    },
    openCreateDialog() {
      this.createForm = {
        payNo: "",
        salesNo: "",
        refundAmount: 1,
        refundReason: ""
      }
      this.createOpen = true
    },
    submitCreate() {
      this.$refs.createForm.validate(valid => {
        if (!valid) return
        addRefund({
          ...this.createForm,
          items: [{
            sales_no: this.createForm.salesNo,
            refund_amount: this.createForm.refundAmount
          }]
        }).then(() => {
          this.$modal.msgSuccess("退款单创建成功")
          this.createOpen = false
          this.getList()
        })
      })
    },
    resolveRefundStatus(status) {
      return refundStatusMap[status]?.label || status
    },
    resolveRefundType(status) {
      return refundStatusMap[status]?.type || "info"
    },
    formatMoney(value) {
      return `¥${(Number(value || 0) / 100).toFixed(2)}`
    }
  }
}
</script>
