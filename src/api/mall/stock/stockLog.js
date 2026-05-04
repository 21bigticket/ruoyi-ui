import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-stock/stock_log.StockLogService'

export function listStockLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      sku_id: query.skuId,
      change_type: query.changeType,
      order_no: query.orderNo,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.stock_logs || [], total: res.total || 0 }))
}

export function getStockLog(logId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { log_id: logId }
  }).then(res => ({ data: res.stock_log }))
}

export function listStockLogBySku(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/GetLogsBySku`,
    method: 'post',
    data: {
      sku_id: query.skuId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.stock_logs || [], total: res.total || 0 }))
}

export function listStockLogByOrder(query = {}) {
  return request({
    url: `${base}/GetLogsByOrder`,
    method: 'post',
    data: {
      order_no: query.orderNo,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10
    }
  }).then(res => ({ rows: res.stock_logs || [], total: res.total || 0 }))
}
