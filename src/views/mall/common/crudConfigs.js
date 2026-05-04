import { listCategory, getCategory, addCategory, updateCategory, delCategory } from "@/api/mall/goods/category"
import { listAttribute, getAttribute, addAttribute, updateAttribute, delAttribute } from "@/api/mall/goods/attribute"
import { listVendor, getVendor, addVendor, updateVendor, delVendor } from "@/api/mall/goods/vendor"
import { listGoods, getGoods, addGoods, updateGoods, delGoods } from "@/api/mall/goods/goods"
import { listSku, getSku, addSku, updateSku, delSku } from "@/api/mall/goods/sku"
import { listSmsTemplate, listSmsLog, getSmsTemplate, addSmsTemplate, updateSmsTemplate, delSmsTemplate } from "@/api/mall/message/sms"
import { listWeixinTemplate, listWeixinLog, getWeixinTemplate, addWeixinTemplate, updateWeixinTemplate, delWeixinTemplate } from "@/api/mall/message/weixin"

const enableStatusOptions = [
  { label: "禁用", value: 0, type: "info" },
  { label: "启用", value: 1, type: "success" }
]

const queryStatusOptions = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
]

function normalizeItem(item) {
  if (!item) {
    return {}
  }
  const result = {}
  Object.keys(item).forEach(key => {
    const camel = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
    result[camel] = item[key]
  })
  return result
}

export const goodsCrudConfigs = {
  category: {
    name: "MallCategoryCrudPage",
    entityLabel: "分类",
    permissionPrefix: "mall:category",
    fetchList: listCategory,
    fetchDetail: getCategory,
    createItem: addCategory,
    updateItem: updateCategory,
    deleteItem: delCategory,
    normalizer: normalizeItem,
    defaultQuery: {
      parentId: undefined,
      level: undefined,
      status: undefined
    },
    defaultForm: {
      id: undefined,
      parentId: 0,
      name: "",
      iconUrl: "",
      sortOrder: 0,
      status: 1
    },
    queryFields: [
      { label: "父分类ID", prop: "parentId", type: "number" },
      { label: "层级", prop: "level", type: "number", min: 1 },
      { label: "状态", prop: "status", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "分类ID", prop: "id", width: 100 },
      { label: "父分类ID", prop: "parentId", width: 110 },
      { label: "分类名称", prop: "name", minWidth: 160 },
      { label: "层级", prop: "level", width: 90 },
      { label: "图标", prop: "iconUrl", type: "image", width: 90, showOverflowTooltip: false },
      { label: "排序", prop: "sortOrder", width: 90 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    formFields: [
      { label: "父分类ID", prop: "parentId", type: "number" },
      { label: "分类名称", prop: "name" },
      { label: "图标地址", prop: "iconUrl" },
      { label: "排序", prop: "sortOrder", type: "number" },
      { label: "状态", prop: "status", type: "radio", options: enableStatusOptions }
    ],
    rules: {
      name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }]
    }
  },
  attribute: {
    name: "MallAttributeCrudPage",
    entityLabel: "属性",
    permissionPrefix: "mall:attribute",
    fetchList: listAttribute,
    fetchDetail: getAttribute,
    createItem: addAttribute,
    updateItem: updateAttribute,
    deleteItem: delAttribute,
    normalizer: normalizeItem,
    defaultQuery: {
      parentId: undefined,
      type: undefined,
      status: undefined
    },
    defaultForm: {
      id: undefined,
      parentId: 0,
      name: "",
      type: 1,
      sortOrder: 0,
      status: 1
    },
    queryFields: [
      { label: "父属性ID", prop: "parentId", type: "number" },
      { label: "属性类型", prop: "type", type: "select", options: [{ label: "规格", value: 1 }, { label: "参数", value: 2 }, { label: "属性", value: 3 }] },
      { label: "状态", prop: "status", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "属性ID", prop: "id", width: 100 },
      { label: "父属性ID", prop: "parentId", width: 110 },
      { label: "属性名称", prop: "name", minWidth: 160 },
      { label: "类型", prop: "type", width: 90 },
      { label: "排序", prop: "sortOrder", width: 90 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ],
    formFields: [
      { label: "父属性ID", prop: "parentId", type: "number" },
      { label: "属性名称", prop: "name" },
      { label: "属性类型", prop: "type", type: "select", options: [{ label: "规格", value: 1 }, { label: "参数", value: 2 }, { label: "属性", value: 3 }] },
      { label: "排序", prop: "sortOrder", type: "number" },
      { label: "状态", prop: "status", type: "radio", options: enableStatusOptions }
    ],
    rules: {
      name: [{ required: true, message: "属性名称不能为空", trigger: "blur" }],
      type: [{ required: true, message: "属性类型不能为空", trigger: "change" }]
    }
  },
  vendor: {
    name: "MallVendorCrudPage",
    entityLabel: "供应商",
    permissionPrefix: "mall:vendor",
    fetchList: listVendor,
    fetchDetail: getVendor,
    createItem: addVendor,
    updateItem: updateVendor,
    deleteItem: delVendor,
    normalizer: normalizeItem,
    defaultQuery: {
      name: undefined,
      status: undefined
    },
    defaultForm: {
      id: undefined,
      code: "",
      name: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
      status: 1
    },
    queryFields: [
      { label: "供应商名称", prop: "name" },
      { label: "状态", prop: "status", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "供应商ID", prop: "id", width: 110 },
      { label: "供应商编码", prop: "code", minWidth: 140 },
      { label: "供应商名称", prop: "name", minWidth: 160 },
      { label: "联系人", prop: "contact", width: 120 },
      { label: "手机号", prop: "phone", minWidth: 140 },
      { label: "邮箱", prop: "email", minWidth: 180 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions }
    ],
    formFields: [
      { label: "供应商编码", prop: "code", readonlyOnEdit: true },
      { label: "供应商名称", prop: "name" },
      { label: "联系人", prop: "contact" },
      { label: "手机号", prop: "phone" },
      { label: "邮箱", prop: "email" },
      { label: "联系地址", prop: "address", type: "textarea", rows: 2 },
      { label: "状态", prop: "status", type: "radio", options: enableStatusOptions }
    ],
    rules: {
      code: [{ required: true, message: "供应商编码不能为空", trigger: "blur" }],
      name: [{ required: true, message: "供应商名称不能为空", trigger: "blur" }]
    }
  },
  goods: {
    name: "MallGoodsCrudPage",
    entityLabel: "商品",
    permissionPrefix: "mall:goods",
    fetchList: listGoods,
    fetchDetail: getGoods,
    createItem: addGoods,
    updateItem: updateGoods,
    deleteItem: delGoods,
    normalizer: normalizeItem,
    dialogWidth: "720px",
    defaultQuery: {
      name: undefined,
      categoryId: undefined,
      vendorId: undefined,
      brandId: undefined,
      status: undefined
    },
    defaultForm: {
      id: undefined,
      categoryId: undefined,
      vendorId: undefined,
      brandId: undefined,
      name: "",
      subTitle: "",
      mainImage: "",
      detail: "",
      sortOrder: 0,
      status: 1
    },
    queryFields: [
      { label: "商品名称", prop: "name" },
      { label: "分类ID", prop: "categoryId", type: "number" },
      { label: "供应商ID", prop: "vendorId", type: "number" },
      { label: "品牌ID", prop: "brandId", type: "number" },
      { label: "状态", prop: "status", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "商品ID", prop: "id", width: 100 },
      { label: "商品名称", prop: "name", minWidth: 160 },
      { label: "副标题", prop: "subTitle", minWidth: 180 },
      { label: "分类ID", prop: "categoryId", width: 100 },
      { label: "供应商ID", prop: "vendorId", width: 110 },
      { label: "品牌ID", prop: "brandId", width: 100 },
      { label: "排序", prop: "sortOrder", width: 90 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions }
    ],
    formFields: [
      { label: "分类ID", prop: "categoryId", type: "number" },
      { label: "供应商ID", prop: "vendorId", type: "number" },
      { label: "品牌ID", prop: "brandId", type: "number" },
      { label: "商品名称", prop: "name" },
      { label: "副标题", prop: "subTitle" },
      { label: "主图地址", prop: "mainImage" },
      { label: "排序", prop: "sortOrder", type: "number" },
      { label: "状态", prop: "status", type: "radio", options: enableStatusOptions },
      { label: "商品详情", prop: "detail", type: "textarea", rows: 5 }
    ],
    rules: {
      categoryId: [{ required: true, message: "分类ID不能为空", trigger: "blur" }],
      vendorId: [{ required: true, message: "供应商ID不能为空", trigger: "blur" }],
      brandId: [{ required: true, message: "品牌ID不能为空", trigger: "blur" }],
      name: [{ required: true, message: "商品名称不能为空", trigger: "blur" }]
    }
  },
  sku: {
    name: "MallSkuCrudPage",
    entityLabel: "SKU",
    permissionPrefix: "mall:sku",
    fetchList: listSku,
    fetchDetail: getSku,
    createItem: addSku,
    updateItem: updateSku,
    deleteItem: delSku,
    normalizer: normalizeItem,
    defaultQuery: {
      goodsId: undefined,
      status: undefined
    },
    defaultForm: {
      id: undefined,
      goodsId: undefined,
      skuCode: "",
      name: "",
      price: 0,
      imageUrl: "",
      sortOrder: 0,
      status: 1
    },
    queryFields: [
      { label: "商品ID", prop: "goodsId", type: "number" },
      { label: "状态", prop: "status", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "SKU ID", prop: "id", width: 100 },
      { label: "商品ID", prop: "goodsId", width: 100 },
      { label: "SKU编码", prop: "skuCode", minWidth: 140 },
      { label: "SKU名称", prop: "name", minWidth: 160 },
      { label: "价格", prop: "price", type: "money", width: 110 },
      { label: "状态", prop: "status", type: "tag", width: 90, options: enableStatusOptions }
    ],
    formFields: [
      { label: "商品ID", prop: "goodsId", type: "number", readonlyOnEdit: true },
      { label: "SKU编码", prop: "skuCode", readonlyOnEdit: true },
      { label: "SKU名称", prop: "name" },
      { label: "价格(分)", prop: "price", type: "number" },
      { label: "图片地址", prop: "imageUrl" },
      { label: "排序", prop: "sortOrder", type: "number" },
      { label: "状态", prop: "status", type: "radio", options: enableStatusOptions }
    ],
    rules: {
      goodsId: [{ required: true, message: "商品ID不能为空", trigger: "blur" }],
      skuCode: [{ required: true, message: "SKU编码不能为空", trigger: "blur" }],
      name: [{ required: true, message: "SKU名称不能为空", trigger: "blur" }]
    }
  }
}

export const messageCrudConfigs = {
  smsTemplate: {
    name: "MallSmsTemplateCrudPage",
    entityLabel: "短信模板",
    permissionPrefix: "mall:sms",
    addPermissions: ["mall:sms:list"],
    editPermissions: ["mall:sms:list"],
    removePermissions: ["mall:sms:list"],
    fetchList: listSmsTemplate,
    fetchDetail: getSmsTemplate,
    createItem: addSmsTemplate,
    updateItem: updateSmsTemplate,
    deleteItem: delSmsTemplate,
    normalizer: normalizeItem,
    defaultQuery: {
      tplStatus: undefined
    },
    defaultForm: {
      tplId: undefined,
      tplCode: "",
      tplName: "",
      tplContent: "",
      tplStatus: 1
    },
    queryFields: [
      { label: "模板状态", prop: "tplStatus", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "模板ID", prop: "tplId", width: 100 },
      { label: "模板编码", prop: "tplCode", minWidth: 150 },
      { label: "模板名称", prop: "tplName", minWidth: 160 },
      { label: "模板内容", prop: "tplContent", minWidth: 220 },
      { label: "状态", prop: "tplStatus", type: "tag", width: 90, options: enableStatusOptions }
    ],
    formFields: [
      { label: "模板编码", prop: "tplCode", readonlyOnEdit: true },
      { label: "模板名称", prop: "tplName" },
      { label: "模板内容", prop: "tplContent", type: "textarea", rows: 4 },
      { label: "状态", prop: "tplStatus", type: "radio", options: enableStatusOptions }
    ],
    rules: {
      tplCode: [{ required: true, message: "模板编码不能为空", trigger: "blur" }],
      tplName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
      tplContent: [{ required: true, message: "模板内容不能为空", trigger: "blur" }]
    }
  },
  weixinTemplate: {
    name: "MallWeixinTemplateCrudPage",
    entityLabel: "微信模板",
    permissionPrefix: "mall:weixin",
    addPermissions: ["mall:weixin:list"],
    editPermissions: ["mall:weixin:list"],
    removePermissions: ["mall:weixin:list"],
    fetchList: listWeixinTemplate,
    fetchDetail: getWeixinTemplate,
    createItem: addWeixinTemplate,
    updateItem: updateWeixinTemplate,
    deleteItem: delWeixinTemplate,
    normalizer: normalizeItem,
    defaultQuery: {
      tplStatus: undefined
    },
    defaultForm: {
      tplId: undefined,
      tplCode: "",
      tplName: "",
      tplIdWeixin: "",
      tplStatus: 1
    },
    queryFields: [
      { label: "模板状态", prop: "tplStatus", type: "select", options: queryStatusOptions }
    ],
    columns: [
      { label: "模板ID", prop: "tplId", width: 100 },
      { label: "模板编码", prop: "tplCode", minWidth: 150 },
      { label: "模板名称", prop: "tplName", minWidth: 160 },
      { label: "微信模板ID", prop: "tplIdWeixin", minWidth: 180 },
      { label: "状态", prop: "tplStatus", type: "tag", width: 90, options: enableStatusOptions }
    ],
    formFields: [
      { label: "模板编码", prop: "tplCode", readonlyOnEdit: true },
      { label: "模板名称", prop: "tplName" },
      { label: "微信模板ID", prop: "tplIdWeixin" },
      { label: "状态", prop: "tplStatus", type: "radio", options: enableStatusOptions }
    ],
    rules: {
      tplCode: [{ required: true, message: "模板编码不能为空", trigger: "blur" }],
      tplName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
      tplIdWeixin: [{ required: true, message: "微信模板ID不能为空", trigger: "blur" }]
    }
  }
}

export const messageLogConfigs = {
  sms: {
    listFn: listSmsLog,
    defaultQuery: {
      phone: undefined,
      tplCode: undefined,
      status: undefined
    },
    queryFields: [
      { label: "手机号", prop: "phone" },
      { label: "模板编码", prop: "tplCode" },
      { label: "发送状态", prop: "status", type: "select", options: [{ label: "成功", value: 1 }, { label: "失败", value: 0 }] }
    ],
    columns: [
      { label: "日志ID", prop: "logId", width: 100 },
      { label: "消息ID", prop: "msgId", minWidth: 150 },
      { label: "手机号", prop: "phone", minWidth: 130 },
      { label: "模板编码", prop: "tplCode", minWidth: 150 },
      { label: "内容", prop: "content", minWidth: 220 },
      { label: "状态", prop: "status", width: 90 },
      { label: "重试次数", prop: "retryCount", width: 90 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  },
  weixin: {
    listFn: listWeixinLog,
    defaultQuery: {
      openid: undefined,
      tplCode: undefined,
      status: undefined
    },
    queryFields: [
      { label: "OpenID", prop: "openid" },
      { label: "模板编码", prop: "tplCode" },
      { label: "发送状态", prop: "status", type: "select", options: [{ label: "成功", value: 1 }, { label: "失败", value: 0 }] }
    ],
    columns: [
      { label: "日志ID", prop: "logId", width: 100 },
      { label: "消息ID", prop: "msgId", minWidth: 150 },
      { label: "OpenID", prop: "openid", minWidth: 180 },
      { label: "模板编码", prop: "tplCode", minWidth: 150 },
      { label: "内容", prop: "content", minWidth: 220 },
      { label: "状态", prop: "status", width: 90 },
      { label: "重试次数", prop: "retryCount", width: 90 },
      { label: "创建时间", prop: "createTime", type: "time", width: 180 }
    ]
  }
}
