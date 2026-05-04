import { listCategory } from "@/api/mall/goods/category"
import { listAttribute } from "@/api/mall/goods/attribute"
import { listVendor } from "@/api/mall/goods/vendor"
import { listGoods } from "@/api/mall/goods/goods"
import { listSku } from "@/api/mall/goods/sku"
import { listStock } from "@/api/mall/stock/stock"
import { listStockLog } from "@/api/mall/stock/stockLog"
import { listMember } from "@/api/mall/member/member"
import { pageMemberAddress } from "@/api/mall/member/address"
import { pageMemberCollect } from "@/api/mall/member/collect"
import { getMemberItem } from "@/api/mall/member/item"
import { listCart } from "@/api/mall/cart/cart"
import { listCartItem } from "@/api/mall/cart/cartItem"
import { listCartLog } from "@/api/mall/cart/cartLog"
import { listActivity } from "@/api/mall/activity/activity"
import { listActivityGoods } from "@/api/mall/activity/activityGoods"
import { listCoupon } from "@/api/mall/activity/coupon"
import { listUserCoupon } from "@/api/mall/activity/userCoupon"
import { listUserCouponLog } from "@/api/mall/activity/userCouponLog"
import { listOrder } from "@/api/mall/order/order"
import { getDelivery } from "@/api/mall/order/delivery"
import { listAfterSales } from "@/api/mall/order/afterSales"
import { listOrderLog } from "@/api/mall/order/orderLog"
import { listPayment, listRefund } from "@/api/mall/pay/payment"
import { listSmsTemplate } from "@/api/mall/message/sms"
import { listWeixinTemplate } from "@/api/mall/message/weixin"

const enableStatusOptions = [
  { label: "禁用", value: 0, type: "info" },
  { label: "启用", value: 1, type: "success" }
]

const defaultStatusOptions = [
  { label: "全部", value: -1 },
  ...enableStatusOptions
]

const yesNoOptions = [
  { label: "否", value: 0, type: "info" },
  { label: "是", value: 1, type: "success" }
]

const collectStatusOptions = [
  { label: "取消收藏", value: 0, type: "info" },
  { label: "已收藏", value: 1, type: "success" }
]

const activityTypeOptions = [
  { label: "全部", value: -1 },
  { label: "秒杀", value: 1 },
  { label: "拼团", value: 2 },
  { label: "满减", value: 3 },
  { label: "折扣", value: 4 }
]

const activityStatusOptions = [
  { label: "全部", value: -1 },
  { label: "未开始", value: 0, type: "info" },
  { label: "进行中", value: 1, type: "success" },
  { label: "已结束", value: 2, type: "warning" },
  { label: "已取消", value: 3, type: "danger" }
]

const couponTypeOptions = [
  { label: "全部", value: -1 },
  { label: "满减券", value: 1 },
  { label: "折扣券", value: 2 },
  { label: "兑换券", value: 3 }
]

const couponLogActionOptions = [
  { label: "全部", value: "" },
  { label: "预占", value: "reserve" },
  { label: "释放", value: "release" },
  { label: "使用", value: "use" }
]

const couponLogResultOptions = [
  { label: "全部", value: "" },
  { label: "成功", value: "success", type: "success" },
  { label: "失败", value: "failed", type: "danger" }
]

const orderStatusOptions = [
  { label: "全部", value: -1 },
  { label: "待支付", value: 0, type: "info" },
  { label: "已支付", value: 1, type: "success" },
  { label: "已发货", value: 2, type: "warning" },
  { label: "已完成", value: 3, type: "success" },
  { label: "已取消", value: 4, type: "danger" },
  { label: "售后中", value: 5, type: "warning" }
]

const deliveryStatusOptions = [
  { label: "运输中", value: 0, type: "warning" },
  { label: "已签收", value: 1, type: "success" },
  { label: "异常", value: 2, type: "danger" }
]

const afterSalesStatusOptions = [
  { label: "全部", value: -1 },
  { label: "待审核", value: 0, type: "info" },
  { label: "已通过", value: 1, type: "success" },
  { label: "已拒绝", value: 2, type: "danger" },
  { label: "退款中", value: 3, type: "warning" },
  { label: "已完成", value: 4, type: "success" }
]

const payTypeOptions = [
  { label: "全部", value: 0 },
  { label: "支付宝", value: 1 },
  { label: "微信", value: 2 },
  { label: "余额", value: 3 }
]

const payStatusOptions = [
  { label: "全部", value: -1 },
  { label: "待支付", value: 0, type: "info" },
  { label: "支付成功", value: 1, type: "success" },
  { label: "支付失败", value: 2, type: "danger" },
  { label: "已退款", value: 3, type: "warning" }
]

const refundStatusOptions = [
  { label: "全部", value: -1 },
  { label: "退款中", value: 0, type: "warning" },
  { label: "退款成功", value: 1, type: "success" },
  { label: "退款失败", value: 2, type: "danger" }
]

const salesTypeOptions = [
  { label: "退款", value: 1 },
  { label: "退货退款", value: 2 }
]

function withRequiredQuery(keys, fetchFn) {
  return query => {
    const hasQuery = keys.some(key => query[key] !== undefined && query[key] !== null && query[key] !== "")
    if (!hasQuery) {
      return Promise.resolve({ rows: [], total: 0 })
    }
    return fetchFn(query)
  }
}

function withSingleRow(fetchFn, getArgs) {
  return query => {
    const args = getArgs(query)
    if (!args) {
      return Promise.resolve({ rows: [], total: 0 })
    }
    return fetchFn(args).then(response => {
      const row = response?.data
      return {
        rows: row ? [row] : [],
        total: row ? 1 : 0
      }
    })
  }
}

export const pageConfigs = {
  goodsCategory: {
    name: "MallGoodsCategoryPage",
    fetchFn: listCategory,
    filters: [
      { label: "父分类ID", prop: "parentId", type: "number" },
      { label: "层级", prop: "level", type: "number" },
      { label: "状态", prop: "status", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "分类ID", prop: "id", width: 100 },
      { label: "父分类ID", prop: "parentId", width: 110 },
      { label: "分类名称", prop: "name", minWidth: 180 },
      { label: "图标", prop: "iconUrl", type: "image", width: 90, showOverflowTooltip: false },
      { label: "排序", prop: "sortOrder", width: 90 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  goodsAttribute: {
    name: "MallGoodsAttributePage",
    fetchFn: listAttribute,
    filters: [
      { label: "父属性ID", prop: "parentId", type: "number" },
      { label: "类型", prop: "type", type: "number" },
      { label: "状态", prop: "status", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "属性ID", prop: "id", width: 100 },
      { label: "父属性ID", prop: "parentId", width: 110 },
      { label: "属性名称", prop: "name", minWidth: 180 },
      { label: "类型", prop: "type", width: 90 },
      { label: "排序", prop: "sortOrder", width: 90 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  goodsVendor: {
    name: "MallGoodsVendorPage",
    fetchFn: listVendor,
    filters: [
      { label: "供应商名称", prop: "name" },
      { label: "状态", prop: "status", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "供应商ID", prop: "id", width: 110 },
      { label: "供应商编码", prop: "code", minWidth: 140 },
      { label: "供应商名称", prop: "name", minWidth: 180 },
      { label: "联系人", prop: "contact", width: 120 },
      { label: "联系电话", prop: "phone", minWidth: 140 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  goodsGoods: {
    name: "MallGoodsGoodsPage",
    fetchFn: listGoods,
    filters: [
      { label: "商品名称", prop: "name" },
      { label: "分类ID", prop: "categoryId", type: "number" },
      { label: "品牌ID", prop: "brandId", type: "number" },
      { label: "供应商ID", prop: "vendorId", type: "number" },
      { label: "状态", prop: "status", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "商品ID", prop: "id", width: 100 },
      { label: "商品名称", prop: "name", minWidth: 180 },
      { label: "副标题", prop: "subTitle", minWidth: 180 },
      { label: "分类ID", prop: "categoryId", width: 100 },
      { label: "品牌ID", prop: "brandId", width: 100 },
      { label: "供应商ID", prop: "vendorId", width: 110 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  goodsSku: {
    name: "MallGoodsSkuPage",
    fetchFn: listSku,
    filters: [
      { label: "商品ID", prop: "goodsId", type: "number" },
      { label: "状态", prop: "status", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "SKU ID", prop: "id", width: 100 },
      { label: "商品ID", prop: "goodsId", width: 100 },
      { label: "SKU编码", prop: "skuCode", minWidth: 140 },
      { label: "SKU名称", prop: "name", minWidth: 180 },
      { label: "价格", prop: "price", type: "money", width: 110 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  stockStock: {
    name: "MallStockStockPage",
    fetchFn: listStock,
    filters: [
      { label: "SKU ID", prop: "skuId", type: "number" }
    ],
    columns: [
      { label: "SKU ID", prop: "skuId", width: 120 },
      { label: "可用库存", prop: "stockNum", width: 110 },
      { label: "冻结库存", prop: "freezeNum", width: 110 },
      { label: "累计销量", prop: "saleNum", width: 110 },
      { label: "版本号", prop: "version", width: 90 },
      { label: "更新时间", prop: "updateTime", type: "time", minWidth: 180 }
    ]
  },
  stockLog: {
    name: "MallStockLogPage",
    fetchFn: listStockLog,
    filters: [
      { label: "SKU ID", prop: "skuId", type: "number" },
      { label: "变更类型", prop: "changeType", type: "number" },
      { label: "订单号", prop: "orderNo" },
      { label: "创建时间", prop: "dateRange", type: "daterange" }
    ],
    columns: [
      { label: "日志ID", prop: "logId", width: 110 },
      { label: "SKU ID", prop: "skuId", width: 100 },
      { label: "变更类型", prop: "changeType", width: 100 },
      { label: "变更数量", prop: "changeNum", width: 100 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "备注", prop: "remark", minWidth: 160 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  memberMember: {
    name: "MallMemberMemberPage",
    fetchFn: listMember,
    filters: [
      { label: "会员名称", prop: "name" },
      { label: "会员状态", prop: "memberStatus", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "用户名", prop: "userName", minWidth: 140 },
      { label: "昵称", prop: "nickName", minWidth: 140 },
      { label: "手机号", prop: "phone", minWidth: 140 },
      { label: "邮箱", prop: "email", minWidth: 180 },
      { label: "状态", prop: "memberStatus", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  memberAddress: {
    name: "MallMemberAddressPage",
    fetchFn: pageMemberAddress,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "状态", prop: "addressStatus", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "地址ID", prop: "id", width: 100 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "国家", prop: "country", width: 110 },
      { label: "省份", prop: "province", width: 110 },
      { label: "城市", prop: "city", width: 110 },
      { label: "区域", prop: "region", width: 110 },
      { label: "详细地址", prop: "street", minWidth: 200 },
      { label: "默认地址", prop: "defaultOption", type: "tag", width: 100, options: yesNoOptions }
    ]
  },
  memberCollect: {
    name: "MallMemberCollectPage",
    fetchFn: pageMemberCollect,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "商品ID", prop: "goodsId", type: "number" },
      { label: "SKU ID", prop: "skuId", type: "number" },
      { label: "收藏状态", prop: "collectStatus", type: "select", options: [{ label: "全部", value: -1 }, ...collectStatusOptions] }
    ],
    columns: [
      { label: "收藏ID", prop: "id", width: 100 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "商品ID", prop: "goodsId", width: 100 },
      { label: "SKU ID", prop: "skuId", width: 100 },
      { label: "收藏状态", prop: "collectStatus", type: "tag", width: 100, options: collectStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", minWidth: 180 }
    ]
  },
  memberItem: {
    name: "MallMemberItemPage",
    fetchFn: withSingleRow(getMemberItem, query => query.userId || query.user_id),
    filters: [
      { label: "用户ID", prop: "userId", type: "number" }
    ],
    columns: [
      { label: "资料ID", prop: "id", width: 100 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "性别", prop: "gender", width: 90 },
      { label: "年龄", prop: "age", width: 90 },
      { label: "生日", prop: "birthday", type: "time", width: 180 },
      { label: "创建时间", prop: "createTime", type: "time", minWidth: 180 }
    ],
    notice: "当前会员资料页基于用户ID单条查询，输入用户ID后可查看对应资料。"
  },
  cartCart: {
    name: "MallCartCartPage",
    fetchFn: listCart,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" }
    ],
    columns: [
      { label: "购物车ID", prop: "cartId", width: 110 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 },
      { label: "更新时间", prop: "updateTime", type: "time", minWidth: 180 }
    ],
    notice: "当前购物车列表接口返回购物车基础信息；商品明细请切换到购物车商品页查看。"
  },
  cartItem: {
    name: "MallCartItemPage",
    fetchFn: listCartItem,
    filters: [
      { label: "购物车ID", prop: "cartId", type: "number" },
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "SKU ID", prop: "skuId", type: "number" }
    ],
    columns: [
      { label: "条目ID", prop: "itemId", width: 100 },
      { label: "购物车ID", prop: "cartId", width: 100 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "SKU ID", prop: "skuId", width: 100 },
      { label: "SKU名称", prop: "skuName", minWidth: 180 },
      { label: "单价", prop: "price", type: "money", width: 110 },
      { label: "数量", prop: "quantity", width: 90 }
    ]
  },
  cartLog: {
    name: "MallCartLogPage",
    fetchFn: listCartLog,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "购物车ID", prop: "cartId", type: "number" },
      { label: "操作类型", prop: "action" }
    ],
    columns: [
      { label: "日志ID", prop: "logId", width: 100 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "购物车ID", prop: "cartId", width: 100 },
      { label: "操作", prop: "action", width: 110 },
      { label: "操作描述", prop: "actionDesc", minWidth: 180 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  activityActivity: {
    name: "MallActivityActivityPage",
    fetchFn: listActivity,
    filters: [
      { label: "活动类型", prop: "activityType", type: "select", options: activityTypeOptions },
      { label: "活动状态", prop: "activityStatus", type: "select", options: activityStatusOptions }
    ],
    columns: [
      { label: "活动ID", prop: "activityId", width: 100 },
      { label: "活动名称", prop: "activityName", minWidth: 180 },
      { label: "活动类型", prop: "activityType", width: 100 },
      { label: "开始时间", prop: "startTime", type: "time", width: 180 },
      { label: "结束时间", prop: "endTime", type: "time", width: 180 },
      { label: "活动状态", prop: "activityStatus", type: "tag", width: 100, options: activityStatusOptions.slice(1) }
    ]
  },
  activityGoods: {
    name: "MallActivityGoodsPage",
    fetchFn: withRequiredQuery(["activityId"], listActivityGoods),
    filters: [
      { label: "活动ID", prop: "activityId", type: "number" }
    ],
    columns: [
      { label: "活动商品ID", prop: "activityGoodsId", width: 120 },
      { label: "活动ID", prop: "activityId", width: 100 },
      { label: "SKU ID", prop: "skuId", width: 100 },
      { label: "活动价", prop: "activityPrice", type: "money", width: 110 },
      { label: "库存限制", prop: "stockLimit", width: 100 },
      { label: "每人限购", prop: "limitPerUser", width: 100 },
      { label: "排序", prop: "sortOrder", width: 90 },
      { label: "创建时间", prop: "createTime", type: "time", minWidth: 180 }
    ],
    notice: "活动商品查询依赖活动ID，输入活动ID后可查看配置明细。"
  },
  activityCoupon: {
    name: "MallActivityCouponPage",
    fetchFn: listCoupon,
    filters: [
      { label: "券类型", prop: "type", type: "select", options: couponTypeOptions },
      { label: "状态", prop: "status", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "优惠券ID", prop: "id", width: 110 },
      { label: "优惠券名称", prop: "name", minWidth: 180 },
      { label: "类型", prop: "type", width: 90 },
      { label: "最低金额", prop: "minAmount", type: "money", width: 110 },
      { label: "优惠金额", prop: "discountAmount", type: "money", width: 110 },
      { label: "折扣率", prop: "discountRate", width: 90 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions }
    ]
  },
  activityUserCoupon: {
    name: "MallActivityUserCouponPage",
    fetchFn: withRequiredQuery(["userId"], listUserCoupon),
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "券状态", prop: "couponStatus", type: "number" }
    ],
    columns: [
      { label: "用户券ID", prop: "userCouponId", width: 120 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "优惠券ID", prop: "couponId", width: 110 },
      { label: "券状态", prop: "couponStatus", width: 90 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "领取时间", prop: "receiveTime", type: "time", width: 180 },
      { label: "使用时间", prop: "useTime", type: "time", width: 180 },
      { label: "过期时间", prop: "expireTime", type: "time", width: 180 }
    ],
    notice: "用户优惠券列表建议带用户ID查询，方便联调会员中心与营销中心数据。"
  },
  activityUserCouponLog: {
    name: "MallActivityUserCouponLogPage",
    fetchFn: listUserCouponLog,
    filters: [
      { label: "用户券ID", prop: "userCouponId", type: "number" },
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "优惠券ID", prop: "couponId", type: "number" },
      { label: "订单号", prop: "orderNo" },
      { label: "动作", prop: "action", type: "select", options: couponLogActionOptions },
      { label: "结果", prop: "result", type: "select", options: couponLogResultOptions },
      { label: "创建时间", prop: "dateRange", type: "daterange" }
    ],
    columns: [
      { label: "日志ID", prop: "logId", width: 110 },
      { label: "用户券ID", prop: "userCouponId", width: 120 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "优惠券ID", prop: "couponId", width: 110 },
      { label: "动作", prop: "action", type: "tag", width: 100, options: couponLogActionOptions.slice(1) },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "前置状态", prop: "beforeStatus", width: 100 },
      { label: "后置状态", prop: "afterStatus", width: 100 },
      { label: "结果", prop: "result", type: "tag", width: 90, options: couponLogResultOptions.slice(1) },
      { label: "消息", prop: "message", minWidth: 220 },
      { label: "请求数据", prop: "requestData", type: "json", minWidth: 220 },
      { label: "响应数据", prop: "responseData", type: "json", minWidth: 220 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    notice: "优惠券流水日志用于核对预占、释放、核销链路，支持按用户券、订单号和动作结果排查。"
  },
  orderOrder: {
    name: "MallOrderOrderPage",
    fetchFn: listOrder,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "订单号", prop: "orderNo" },
      { label: "订单状态", prop: "orderStatus", type: "select", options: orderStatusOptions }
    ],
    columns: [
      { label: "订单ID", prop: "orderId", width: 100 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "订单状态", prop: "orderStatus", type: "tag", width: 100, options: orderStatusOptions.slice(1) },
      { label: "订单总额", prop: "totalAmount", type: "money", width: 110 },
      { label: "实付金额", prop: "payAmount", type: "money", width: 110 },
      { label: "下单时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  orderDelivery: {
    name: "MallOrderDeliveryPage",
    fetchFn: withSingleRow(getDelivery, query => {
      if (query.orderNo) {
        return { orderNo: query.orderNo }
      }
      if (query.deliveryNo) {
        return { deliveryNo: query.deliveryNo }
      }
      return null
    }),
    filters: [
      { label: "订单号", prop: "orderNo" },
      { label: "物流单号", prop: "deliveryNo" }
    ],
    columns: [
      { label: "发货ID", prop: "deliveryId", width: 100 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "物流单号", prop: "deliveryNo", minWidth: 160 },
      { label: "物流公司", prop: "deliveryComp", minWidth: 140 },
      { label: "物流状态", prop: "deliveryStatus", type: "tag", width: 100, options: deliveryStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    notice: "当前发货管理页支持按订单号或物流单号精确查询，便于先联通订单与发货流程。"
  },
  orderAfterSales: {
    name: "MallOrderAfterSalesPage",
    fetchFn: listAfterSales,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "订单号", prop: "orderNo" },
      { label: "售后单号", prop: "salesNo" },
      { label: "售后状态", prop: "salesStatus", type: "select", options: afterSalesStatusOptions }
    ],
    columns: [
      { label: "售后ID", prop: "salesId", width: 100 },
      { label: "售后单号", prop: "salesNo", minWidth: 180 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "售后类型", prop: "salesType", width: 90, options: salesTypeOptions },
      { label: "售后状态", prop: "salesStatus", type: "tag", width: 100, options: afterSalesStatusOptions.slice(1) },
      { label: "申请时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  orderLog: {
    name: "MallOrderLogPage",
    fetchFn: withRequiredQuery(["orderNo"], listOrderLog),
    filters: [
      { label: "订单号", prop: "orderNo" },
      { label: "操作", prop: "action" }
    ],
    columns: [
      { label: "日志ID", prop: "logId", width: 100 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "操作", prop: "action", width: 120 },
      { label: "操作人", prop: "operator", width: 120 },
      { label: "操作数据", prop: "actionData", type: "json", minWidth: 220 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    notice: "订单日志查询依赖订单号，输入订单号后可查看订单流转记录。"
  },
  payPayment: {
    name: "MallPayPaymentPage",
    fetchFn: listPayment,
    filters: [
      { label: "用户ID", prop: "userId", type: "number" },
      { label: "订单号", prop: "orderNo" },
      { label: "支付单号", prop: "payNo" },
      { label: "支付方式", prop: "payType", type: "select", options: payTypeOptions },
      { label: "支付状态", prop: "payStatus", type: "select", options: payStatusOptions }
    ],
    columns: [
      { label: "支付ID", prop: "payId", width: 100 },
      { label: "支付单号", prop: "payNo", minWidth: 180 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "用户ID", prop: "userId", width: 100 },
      { label: "支付金额", prop: "payAmount", type: "money", width: 110 },
      { label: "支付方式", prop: "payType", width: 90 },
      { label: "支付状态", prop: "payStatus", type: "tag", width: 100, options: payStatusOptions.slice(1) },
      { label: "支付时间", prop: "payTime", type: "time", width: 180 }
    ]
  },
  payRefund: {
    name: "MallPayRefundPage",
    fetchFn: listRefund,
    filters: [
      { label: "订单号", prop: "orderNo" },
      { label: "支付单号", prop: "payNo" },
      { label: "退款单号", prop: "refundNo" },
      { label: "退款状态", prop: "refundStatus", type: "select", options: refundStatusOptions }
    ],
    columns: [
      { label: "退款ID", prop: "refundId", width: 100 },
      { label: "退款单号", prop: "refundNo", minWidth: 180 },
      { label: "支付单号", prop: "payNo", minWidth: 180 },
      { label: "订单号", prop: "orderNo", minWidth: 180 },
      { label: "退款金额", prop: "refundAmount", type: "money", width: 110 },
      { label: "退款状态", prop: "refundStatus", type: "tag", width: 100, options: refundStatusOptions.slice(1) },
      { label: "退款时间", prop: "refundTime", type: "time", width: 180 }
    ]
  },
  messageSms: {
    name: "MallMessageSmsPage",
    fetchFn: listSmsTemplate,
    filters: [
      { label: "模板状态", prop: "tplStatus", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "模板ID", prop: "tplId", width: 100 },
      { label: "模板编码", prop: "tplCode", minWidth: 160 },
      { label: "模板名称", prop: "tplName", minWidth: 180 },
      { label: "模板内容", prop: "tplContent", minWidth: 240 },
      { label: "状态", prop: "tplStatus", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    notice: "当前短信消息页先聚焦模板管理，发送记录接口已接好，后续可在本页扩展为模板/日志双标签页。"
  },
  messageWeixin: {
    name: "MallMessageWeixinPage",
    fetchFn: listWeixinTemplate,
    filters: [
      { label: "模板状态", prop: "tplStatus", type: "select", options: defaultStatusOptions }
    ],
    columns: [
      { label: "模板ID", prop: "tplId", width: 100 },
      { label: "模板编码", prop: "tplCode", minWidth: 160 },
      { label: "模板名称", prop: "tplName", minWidth: 180 },
      { label: "微信模板ID", prop: "tplIdWeixin", minWidth: 180 },
      { label: "状态", prop: "tplStatus", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    notice: "当前微信消息页先补齐模板管理入口，发送记录后续可在此页继续扩展。"
  }
}
