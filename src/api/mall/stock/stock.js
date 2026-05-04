import request from '@/utils/request'

const base = '/zebra-stock/stock.StockService'

function normalizeStock(row = {}) {
  return {
    skuId: row.skuId ?? row.sku_id ?? 0,
    stockNum: row.stockNum ?? row.stock_num ?? 0,
    freezeNum: row.freezeNum ?? row.freeze_num ?? 0,
    saleNum: row.saleNum ?? row.sale_num ?? 0,
    version: row.version ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function getStock(skuIds) {
  return request({
    url: `${base}/GetStock`,
    method: 'post',
    data: { sku_ids: Array.isArray(skuIds) ? skuIds : [skuIds] }
  }).then(res => {
    const stocks = (res.stocks || []).map(normalizeStock)
    return { rows: stocks, total: stocks.length }
  })
}

export function listStock(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      sku_id: query.skuId
    }
  }).then(res => ({
    rows: (res.stocks || []).map(normalizeStock),
    total: res.total || 0
  }))
}

export function inboundStock(data) {
  return request({
    url: `${base}/Inbound`,
    method: 'post',
    data: {
      sku_id: data.skuId,
      num: data.num,
      order_no: data.orderNo,
      remark: data.remark
    }
  })
}

export function outboundStock(data) {
  return request({
    url: `${base}/Outbound`,
    method: 'post',
    data: {
      sku_id: data.skuId,
      num: data.num,
      order_no: data.orderNo,
      remark: data.remark
    }
  })
}

export function freezeStock(data) {
  return request({
    url: `${base}/Freeze`,
    method: 'post',
    data: {
      sku_id: data.skuId,
      num: data.num,
      order_no: data.orderNo,
      remark: data.remark
    }
  })
}

export function releaseStock(data) {
  return request({
    url: `${base}/Release`,
    method: 'post',
    data: {
      sku_id: data.skuId,
      num: data.num,
      order_no: data.orderNo,
      remark: data.remark
    }
  })
}
