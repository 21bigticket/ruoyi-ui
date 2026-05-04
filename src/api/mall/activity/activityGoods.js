import request from '@/utils/request'

const base = '/zebra-activity/activity_goods.ActivityGoodsService'

function normalizeActivityGoods(row = {}) {
  return {
    activityGoodsId: row.activityGoodsId ?? row.activity_goods_id ?? 0,
    activityId: row.activityId ?? row.activity_id ?? 0,
    skuId: row.skuId ?? row.sku_id ?? 0,
    activityPrice: row.activityPrice ?? row.activity_price ?? 0,
    stockLimit: row.stockLimit ?? row.stock_limit ?? 0,
    limitPerUser: row.limitPerUser ?? row.limit_per_user ?? 0,
    sortOrder: row.sortOrder ?? row.sort_order ?? 0,
    soldQuantity: row.soldQuantity ?? row.sold_quantity ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function listActivityGoods(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      activity_id: query.activityId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10
    }
  }).then(res => ({
    rows: (res.activityGoods || res.activity_goods || []).map(normalizeActivityGoods),
    total: res.total || 0
  }))
}

export function getActivityGoods(activityGoodsId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { activity_goods_id: activityGoodsId }
  }).then(res => ({ data: normalizeActivityGoods(res.activityGoods || res.activity_goods || {}) }))
}

export function addActivityGoods(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      activity_id: data.activityId,
      sku_id: data.skuId,
      activity_price: data.activityPrice,
      stock_limit: data.stockLimit,
      limit_per_user: data.limitPerUser,
      sort_order: data.sortOrder || 0
    }
  })
}

export function updateActivityGoods(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      activity_goods_id: data.activityGoodsId,
      activity_price: data.activityPrice,
      stock_limit: data.stockLimit,
      limit_per_user: data.limitPerUser,
      sort_order: data.sortOrder
    }
  })
}

export function delActivityGoods(activityGoodsId) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { activity_goods_id: activityGoodsId }
  })
}

export function batchDelActivityGoods(activityGoodsIds) {
  return request({
    url: `${base}/BatchDelete`,
    method: 'post',
    data: { activity_goods_ids: activityGoodsIds }
  })
}
