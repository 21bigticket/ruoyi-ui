<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="支付单管理" name="payment">
        <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
          <el-form-item label="支付单号" prop="payNo">
            <el-input v-model="queryParams.payNo" placeholder="请输入支付单号" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable />
          </el-form-item>
          <el-form-item label="用户ID" prop="userId">
            <el-input-number v-model="queryParams.userId" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="支付状态" prop="payStatus">
            <el-select v-model="queryParams.payStatus" placeholder="请选择状态" clearable>
              <el-option v-for="item in payStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付时间">
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

        <el-table v-loading="loading" :data="paymentList">
          <el-table-column label="支付ID" align="center" prop="payId" width="100" />
          <el-table-column label="支付单号" align="center" prop="payNo" min-width="180" />
          <el-table-column label="订单号" align="center" prop="orderNo" min-width="180" />
          <el-table-column label="用户ID" align="center" prop="userId" width="100" />
          <el-table-column label="支付金额" align="center" prop="payAmount" width="120">
            <template slot-scope="scope">{{ formatMoney(scope.row.payAmount) }}</template>
          </el-table-column>
          <el-table-column label="支付方式" align="center" prop="payType" width="100">
            <template slot-scope="scope">{{ resolvePayType(scope.row.payType) }}</template>
          </el-table-column>
          <el-table-column label="支付状态" align="center" prop="payStatus" width="100">
            <template slot-scope="scope">
              <el-tag :type="resolvePayStatusType(scope.row.payStatus)">{{ resolvePayStatus(scope.row.payStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="支付时间" align="center" prop="payTime" width="180">
            <template slot-scope="scope">{{ parseTime(scope.row.payTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-refresh-right"
                v-hasPermi="['mall:payment:callback']"
                :disabled="scope.row.payStatus !== 0"
                @click="openCallbackDialog(scope.row)"
              >回调</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="openLogDialog(scope.row)"
              >日志</el-button>
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
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="支付详情" :visible.sync="detailOpen" width="820px" append-to-body>
      <el-descriptions v-if="detail.payNo" :column="2" border>
        <el-descriptions-item label="支付单号">{{ detail.payNo }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ resolvePayType(detail.payType) }}</el-descriptions-item>
        <el-descriptions-item label="支付状态">{{ resolvePayStatus(detail.payStatus) }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">{{ formatMoney(detail.payAmount) }}</el-descriptions-item>
        <el-descriptions-item label="第三方流水">{{ detail.thirdPartyNo || "-" }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ parseTime(detail.payTime) }}</el-descriptions-item>
        <el-descriptions-item label="通知地址">{{ detail.notifyUrl || "-" }}</el-descriptions-item>
        <el-descriptions-item label="返回地址">{{ detail.returnUrl || "-" }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="支付回调" :visible.sync="callbackOpen" width="520px" append-to-body>
      <el-form ref="callbackForm" :model="callbackForm" :rules="callbackRules" label-width="96px">
        <el-form-item label="支付单号">
          <el-input v-model="callbackForm.payNo" disabled />
        </el-form-item>
        <el-form-item label="第三方流水" prop="thirdPartyNo">
          <el-input v-model="callbackForm.thirdPartyNo" placeholder="请输入第三方流水号" />
        </el-form-item>
        <el-form-item label="回调状态" prop="payStatus">
          <el-radio-group v-model="callbackForm.payStatus">
            <el-radio :label="1">支付成功</el-radio>
            <el-radio :label="2">支付失败</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCallback">确 定</el-button>
        <el-button @click="callbackOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="支付日志" :visible.sync="logOpen" width="960px" append-to-body>
      <el-table v-loading="logLoading" :data="logList">
        <el-table-column label="日志ID" align="center" prop="logId" width="100" />
        <el-table-column label="操作" align="center" prop="action" width="120" />
        <el-table-column label="请求数据" align="center" prop="requestData" min-width="220" :show-overflow-tooltip="true" />
        <el-table-column label="响应数据" align="center" prop="responseData" min-width="220" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { listPayment, getPayment, payCallback, listPaymentLog } from "@/api/mall/pay/payment"

const payTypeMap = {
  1: "支付宝",
  2: "微信",
  3: "余额"
}

const payStatusMap = {
  0: { label: "待支付", type: "info" },
  1: { label: "支付成功", type: "success" },
  2: { label: "支付失败", type: "danger" },
  3: { label: "已退款", type: "warning" }
}

export default {
  name: "MallPaymentManage",
  data() {
    return {
      activeTab: "payment",
      loading: false,
      logLoading: false,
      showSearch: true,
      total: 0,
      paymentList: [],
      detailOpen: false,
      callbackOpen: false,
      logOpen: false,
      detail: {},
      logList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        payNo: undefined,
        orderNo: undefined,
        userId: undefined,
        payStatus: undefined,
        dateRange: []
      },
      callbackForm: {
        payNo: "",
        thirdPartyNo: "",
        payStatus: 1
      },
      callbackRules: {
        thirdPartyNo: [{ required: true, message: "第三方流水号不能为空", trigger: "blur" }],
        payStatus: [{ required: true, message: "回调状态不能为空", trigger: "change" }]
      },
      payStatusOptions: [
        { label: "待支付", value: 0 },
        { label: "支付成功", value: 1 },
        { label: "支付失败", value: 2 },
        { label: "已退款", value: 3 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listPayment(this.queryParams).then(response => {
        this.paymentList = (response.rows || []).map(this.normalizePayment)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizePayment(row) {
      if (!row) return {}
      return {
        payId: row.payId ?? row.pay_id,
        payNo: row.payNo ?? row.pay_no,
        orderNo: row.orderNo ?? row.order_no,
        userId: row.userId ?? row.user_id,
        payAmount: row.payAmount ?? row.pay_amount,
        payType: row.payType ?? row.pay_type,
        payStatus: row.payStatus ?? row.pay_status,
        thirdPartyNo: row.thirdPartyNo ?? row.third_party_no,
        payTime: row.payTime ?? row.pay_time,
        notifyUrl: row.notifyUrl ?? row.notify_url,
        returnUrl: row.returnUrl ?? row.return_url,
        createTime: row.createTime ?? row.create_time
      }
    },
    normalizeLog(row) {
      return {
        logId: row.logId ?? row.log_id,
        action: row.action,
        requestData: row.requestData ?? row.request_data,
        responseData: row.responseData ?? row.response_data,
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
        payNo: undefined,
        orderNo: undefined,
        userId: undefined,
        payStatus: undefined,
        dateRange: []
      }
      this.getList()
    },
    handleDetail(row) {
      getPayment({ payNo: row.payNo }).then(response => {
        this.detail = this.normalizePayment(response.data)
        this.detailOpen = true
      })
    },
    openCallbackDialog(row) {
      this.callbackForm = {
        payNo: row.payNo,
        thirdPartyNo: "",
        payStatus: 1
      }
      this.callbackOpen = true
    },
    submitCallback() {
      this.$refs.callbackForm.validate(valid => {
        if (!valid) return
        payCallback(this.callbackForm).then(() => {
          this.$modal.msgSuccess("回调处理成功")
          this.callbackOpen = false
          this.getList()
        })
      })
    },
    openLogDialog(row) {
      this.logLoading = true
      listPaymentLog({ payNo: row.payNo, pageNum: 1, pageSize: 50 }).then(response => {
        this.logList = (response.rows || []).map(this.normalizeLog)
        this.logOpen = true
      }).finally(() => {
        this.logLoading = false
      })
    },
    resolvePayType(type) {
      return payTypeMap[type] || type
    },
    resolvePayStatus(status) {
      return payStatusMap[status]?.label || status
    },
    resolvePayStatusType(status) {
      return payStatusMap[status]?.type || "info"
    },
    formatMoney(value) {
      return `¥${(Number(value || 0) / 100).toFixed(2)}`
    }
  }
}
</script>
