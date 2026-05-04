import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-cart/cart_log.CartLogService'

export function listCartLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_id: query.userId,
      cart_id: query.cartId,
      action: query.action,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.cart_logs || [], total: res.total || 0 }))
}

export function getCartLog(logId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { log_id: logId }
  }).then(res => ({ data: res.cart_log }))
}

export function listUserCartLogs(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/GetUserLogs`,
    method: 'post',
    data: {
      user_id: query.userId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.cart_logs || [], total: res.total || 0 }))
}

export function listCartLogsByCart(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/GetCartLogs`,
    method: 'post',
    data: {
      cart_id: query.cartId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.cart_logs || [], total: res.total || 0 }))
}
