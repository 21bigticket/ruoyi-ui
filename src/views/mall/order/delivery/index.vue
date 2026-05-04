<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="物流单号" prop="deliveryNo">
        <el-input v-model="queryParams.deliveryNo" placeholder="请输入物流单号" clearable />
      </el-form-item>
      <el-form-item label="物流公司" prop="deliveryComp">
        <el-input v-model="queryParams.deliveryComp" placeholder="请输入物流公司" clearable />
      </el-form-item>
      <el-form-item label="物流状态" prop="deliveryStatus">
        <el-select v-model="queryParams.deliveryStatus" placeholder="请选择状态" clearable>
          <el-option v-for="item in deliveryStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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

    <el-table v-loading="loading" :data="deliveryList">
      <el-table-column label="发货ID" align="center" prop="deliveryId" width="100" />
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="180" />
      <el-table-column label="物流单号" align="center" prop="deliveryNo" min-width="180" />
      <el-table-column label="物流公司" align="center" prop="deliveryComp" min-width="140" />
      <el-table-column label="物流状态" align="center" prop="deliveryStatus" width="100">
        <template slot-scope="scope">
          <el-tag :type="resolveStatusType(scope.row.deliveryStatus)">{{ resolveDeliveryStatus(scope.row.deliveryStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-s-order" @click="goOrder(scope.row)">订单</el-button>
          <el-button size="mini" type="text" icon="el-icon-document" @click="goOrderLog(scope.row)">日志</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh-right"
            :disabled="scope.row.deliveryStatus === 1"
            @click="openStatusDialog(scope.row)"
          >更新状态</el-button>
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

    <el-dialog title="发货详情" :visible.sync="detailOpen" width="760px" append-to-body>
      <el-descriptions v-if="detail.deliveryNo" :column="2" border>
        <el-descriptions-item label="发货ID">{{ detail.deliveryId }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ detail.deliveryNo }}</el-descriptions-item>
        <el-descriptions-item label="物流公司">{{ detail.deliveryComp }}</el-descriptions-item>
        <el-descriptions-item label="物流状态">{{ resolveDeliveryStatus(detail.deliveryStatus) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ parseTime(detail.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ parseTime(detail.updateTime) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="更新物流状态" :visible.sync="statusOpen" width="520px" append-to-body>
      <el-form ref="statusForm" :model="statusForm" :rules="statusRules" label-width="96px">
        <el-form-item label="订单号">
          <el-input v-model="statusForm.orderNo" disabled />
        </el-form-item>
        <el-form-item label="物流状态" prop="deliveryStatus">
          <el-radio-group v-model="statusForm.deliveryStatus">
            <el-radio :label="0">运输中</el-radio>
            <el-radio :label="1">已签收</el-radio>
            <el-radio :label="2">异常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitStatus">确 定</el-button>
        <el-button @click="statusOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDeliveries, getDelivery, updateDeliveryStatus } from "@/api/mall/order/delivery"

const deliveryStatusMap = {
  0: { label: "运输中", type: "warning" },
  1: { label: "已签收", type: "success" },
  2: { label: "异常", type: "danger" }
}

export default {
  name: "MallDeliveryManage",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      deliveryList: [],
      detailOpen: false,
      statusOpen: false,
      detail: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: this.$route.query.orderNo || undefined,
        deliveryNo: undefined,
        deliveryComp: undefined,
        deliveryStatus: undefined,
        dateRange: []
      },
      statusForm: {
        orderNo: "",
        deliveryStatus: 0
      },
      statusRules: {
        deliveryStatus: [{ required: true, message: "物流状态不能为空", trigger: "change" }]
      },
      deliveryStatusOptions: [
        { label: "运输中", value: 0 },
        { label: "已签收", value: 1 },
        { label: "异常", value: 2 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listDeliveries(this.queryParams).then(response => {
        this.deliveryList = (response.rows || []).map(this.normalizeDelivery)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeDelivery(row) {
      if (!row) return {}
      return {
        deliveryId: row.deliveryId ?? row.delivery_id,
        orderNo: row.orderNo ?? row.order_no,
        deliveryNo: row.deliveryNo ?? row.delivery_no,
        deliveryComp: row.deliveryComp ?? row.delivery_comp,
        deliveryStatus: row.deliveryStatus ?? row.delivery_status,
        createTime: row.createTime ?? row.create_time,
        updateTime: row.updateTime ?? row.update_time
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
        deliveryNo: undefined,
        deliveryComp: undefined,
        deliveryStatus: undefined,
        dateRange: []
      }
      this.getList()
    },
    handleDetail(row) {
      getDelivery({ orderNo: row.orderNo }).then(response => {
        this.detail = this.normalizeDelivery(response.data)
        this.detailOpen = true
      })
    },
    openStatusDialog(row) {
      this.statusForm = {
        orderNo: row.orderNo,
        deliveryStatus: row.deliveryStatus
      }
      this.statusOpen = true
    },
    submitStatus() {
      this.$refs.statusForm.validate(valid => {
        if (!valid) return
        updateDeliveryStatus(this.statusForm.orderNo, this.statusForm.deliveryStatus).then(() => {
          this.$modal.msgSuccess("物流状态更新成功")
          this.statusOpen = false
          this.getList()
        })
      })
    },
    goOrder(row) {
      this.$router.push({
        path: "/mall/order/order",
        query: { orderNo: row.orderNo }
      })
    },
    goOrderLog(row) {
      this.$router.push({
        path: "/mall/order/log",
        query: { orderNo: row.orderNo }
      })
    },
    resolveDeliveryStatus(status) {
      return deliveryStatusMap[status]?.label || status
    },
    resolveStatusType(status) {
      return deliveryStatusMap[status]?.type || "info"
    }
  }
}
</script>
