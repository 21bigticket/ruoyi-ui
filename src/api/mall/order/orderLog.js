import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-order/log.OrderLogService'

export function listOrderLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/GetOrderLogs`,
    method: 'post',
    data: {
      order_no: query.orderNo,
      action: query.action,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.logs || [], total: res.total || 0 }))
}

export function addOrderLog(data) {
  return request({
    url: `${base}/CreateOrderLog`,
    method: 'post',
    data: {
      order_no: data.orderNo,
      action: data.action,
      action_data: data.actionData,
      operator: data.operator
    }
  })
}
