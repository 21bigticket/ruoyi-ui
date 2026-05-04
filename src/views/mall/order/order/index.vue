<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input-number v-model="queryParams.userId" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择状态" clearable>
          <el-option v-for="item in orderStatusQueryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
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

    <el-table v-loading="loading" :data="orderList">
      <el-table-column label="订单ID" align="center" prop="orderId" width="100" />
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="180" />
      <el-table-column label="用户ID" align="center" prop="userId" width="100" />
      <el-table-column label="订单状态" align="center" prop="orderStatus" width="100">
        <template slot-scope="scope">
          <el-tag :type="resolveStatusType(scope.row.orderStatus)">{{ resolveOrderStatus(scope.row.orderStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单总额" align="center" prop="totalAmount" width="120">
        <template slot-scope="scope">{{ formatMoney(scope.row.totalAmount) }}</template>
      </el-table-column>
      <el-table-column label="实付金额" align="center" prop="payAmount" width="120">
        <template slot-scope="scope">{{ formatMoney(scope.row.payAmount) }}</template>
      </el-table-column>
      <el-table-column label="收货人" align="center" prop="receiverName" width="120" />
      <el-table-column label="下单时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-document" @click="goOrderLog(scope.row)">日志</el-button>
          <el-button size="mini" type="text" icon="el-icon-truck" @click="goDelivery(scope.row)">物流</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            v-hasPermi="['mall:order:cancel']"
            :disabled="scope.row.orderStatus !== 0"
            @click="handleCancel(scope.row)"
          >取消</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-truck"
            v-hasPermi="['mall:order:deliver']"
            :disabled="scope.row.orderStatus !== 1"
            @click="openDeliverDialog(scope.row)"
          >发货</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            :disabled="scope.row.orderStatus !== 2"
            @click="handleFinish(scope.row)"
          >完成</el-button>
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

    <el-dialog title="订单详情" :visible.sync="detailOpen" width="900px" append-to-body>
      <div v-if="detail.orderNo" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{ resolveOrderStatus(detail.orderStatus) }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
          <el-descriptions-item label="收货人">{{ detail.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detail.receiverPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ detail.receiverAddress }}</el-descriptions-item>
          <el-descriptions-item label="订单总额">{{ formatMoney(detail.totalAmount) }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">{{ formatMoney(detail.payAmount) }}</el-descriptions-item>
          <el-descriptions-item label="优惠金额">{{ formatMoney(detail.discountAmount) }}</el-descriptions-item>
          <el-descriptions-item label="运费">{{ formatMoney(detail.freightAmount) }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ parseTime(detail.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ parseTime(detail.updateTime) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">商品明细</el-divider>
        <el-table :data="detailItems">
          <el-table-column label="订单项ID" align="center" prop="itemId" width="110" />
          <el-table-column label="SKU ID" align="center" prop="skuId" width="100" />
          <el-table-column label="SKU名称" align="center" prop="skuName" min-width="180" />
          <el-table-column label="单价" align="center" prop="price" width="110">
            <template slot-scope="scope">{{ formatMoney(scope.row.price) }}</template>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="quantity" width="90" />
          <el-table-column label="小计" align="center" prop="totalAmount" width="120">
            <template slot-scope="scope">{{ formatMoney(scope.row.totalAmount) }}</template>
          </el-table-column>
        </el-table>

        <template v-if="detailDelivery && detailDelivery.deliveryNo">
          <el-divider content-position="left">发货信息</el-divider>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="物流单号">{{ detailDelivery.deliveryNo }}</el-descriptions-item>
            <el-descriptions-item label="物流公司">{{ detailDelivery.deliveryComp }}</el-descriptions-item>
            <el-descriptions-item label="物流状态">{{ resolveDeliveryStatus(detailDelivery.deliveryStatus) }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ parseTime(detailDelivery.createTime) }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </div>
    </el-dialog>

    <el-dialog title="订单发货" :visible.sync="deliverOpen" width="520px" append-to-body>
      <el-form ref="deliverForm" :model="deliverForm" :rules="deliverRules" label-width="96px">
        <el-form-item label="订单号">
          <el-input v-model="deliverForm.orderNo" disabled />
        </el-form-item>
        <el-form-item label="物流单号" prop="deliveryNo">
          <el-input v-model="deliverForm.deliveryNo" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="物流公司" prop="deliveryComp">
          <el-input v-model="deliverForm.deliveryComp" placeholder="请输入物流公司" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDeliver">确 定</el-button>
        <el-button @click="deliverOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, getOrder, cancelOrder, deliverOrder, finishOrder } from "@/api/mall/order/order"

const orderStatusOptions = {
  0: { label: "待支付", type: "info" },
  1: { label: "已支付", type: "success" },
  2: { label: "已发货", type: "warning" },
  3: { label: "已完成", type: "success" },
  4: { label: "已取消", type: "danger" },
  5: { label: "售后中", type: "warning" }
}

const deliveryStatusOptions = {
  0: "运输中",
  1: "已签收",
  2: "异常"
}

export default {
  name: "MallOrderManage",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      orderList: [],
      detailOpen: false,
      deliverOpen: false,
      detail: {},
      detailItems: [],
      detailDelivery: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
        userId: undefined,
        orderStatus: undefined,
        dateRange: []
      },
      deliverForm: {
        orderNo: "",
        deliveryNo: "",
        deliveryComp: ""
      },
      deliverRules: {
        deliveryNo: [{ required: true, message: "物流单号不能为空", trigger: "blur" }],
        deliveryComp: [{ required: true, message: "物流公司不能为空", trigger: "blur" }]
      },
      orderStatusQueryOptions: [
        { label: "待支付", value: 0 },
        { label: "已支付", value: 1 },
        { label: "已发货", value: 2 },
        { label: "已完成", value: 3 },
        { label: "已取消", value: 4 },
        { label: "售后中", value: 5 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listOrder(this.queryParams).then(response => {
        this.orderList = (response.rows || []).map(this.normalizeOrder)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeOrder(row) {
      if (!row) return {}
      return {
        orderId: row.orderId ?? row.order_id,
        orderNo: row.orderNo ?? row.order_no,
        userId: row.userId ?? row.user_id,
        orderStatus: row.orderStatus ?? row.order_status,
        totalAmount: row.totalAmount ?? row.total_amount,
        payAmount: row.payAmount ?? row.pay_amount,
        discountAmount: row.discountAmount ?? row.discount_amount,
        freightAmount: row.freightAmount ?? row.freight_amount,
        receiverName: row.receiverName ?? row.receiver_name,
        receiverPhone: row.receiverPhone ?? row.receiver_phone,
        receiverAddress: row.receiverAddress ?? row.receiver_address,
        createTime: row.createTime ?? row.create_time,
        updateTime: row.updateTime ?? row.update_time
      }
    },
    normalizeOrderItem(row) {
      return {
        itemId: row.itemId ?? row.item_id,
        skuId: row.skuId ?? row.sku_id,
        skuName: row.skuName ?? row.sku_name,
        price: row.price,
        quantity: row.quantity,
        totalAmount: row.totalAmount ?? row.total_amount
      }
    },
    normalizeDelivery(row) {
      if (!row) return {}
      return {
        deliveryNo: row.deliveryNo ?? row.delivery_no,
        deliveryComp: row.deliveryComp ?? row.delivery_comp,
        deliveryStatus: row.deliveryStatus ?? row.delivery_status,
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
        userId: undefined,
        orderStatus: undefined,
        dateRange: []
      }
      this.getList()
    },
    handleDetail(row) {
      getOrder({ orderNo: row.orderNo }).then(response => {
        this.detail = this.normalizeOrder(response.data)
        this.detailItems = (response.items || []).map(this.normalizeOrderItem)
        this.detailDelivery = this.normalizeDelivery(response.delivery)
        this.detailOpen = true
      })
    },
    handleCancel(row) {
      this.$modal.confirm(`确认取消订单 "${row.orderNo}" 吗？`).then(() => {
        return cancelOrder(row.orderNo, row.userId)
      }).then(() => {
        this.$modal.msgSuccess("取消成功")
        this.getList()
      }).catch(() => {})
    },
    openDeliverDialog(row) {
      this.deliverForm = {
        orderNo: row.orderNo,
        deliveryNo: "",
        deliveryComp: ""
      }
      this.deliverOpen = true
    },
    submitDeliver() {
      this.$refs.deliverForm.validate(valid => {
        if (!valid) return
        deliverOrder(this.deliverForm).then(() => {
          this.$modal.msgSuccess("发货成功")
          this.deliverOpen = false
          this.getList()
        })
      })
    },
    handleFinish(row) {
      this.$modal.confirm(`确认将订单 "${row.orderNo}" 标记为已完成吗？`).then(() => {
        return finishOrder(row.orderNo)
      }).then(() => {
        this.$modal.msgSuccess("订单已完成")
        this.getList()
      }).catch(() => {})
    },
    goOrderLog(row) {
      this.$router.push({
        path: "/mall/order/log",
        query: { orderNo: row.orderNo }
      })
    },
    goDelivery(row) {
      this.$router.push({
        path: "/mall/order/delivery",
        query: { orderNo: row.orderNo }
      })
    },
    resolveOrderStatus(status) {
      return orderStatusOptions[status]?.label || status
    },
    resolveStatusType(status) {
      return orderStatusOptions[status]?.type || "info"
    },
    resolveDeliveryStatus(status) {
      return deliveryStatusOptions[status] || status
    },
    formatMoney(value) {
      const amount = Number(value || 0)
      return `¥${(amount / 100).toFixed(2)}`
    }
  }
}
</script>
