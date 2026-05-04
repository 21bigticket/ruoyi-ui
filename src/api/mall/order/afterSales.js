import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-order/after_sales.AfterSalesService'

export function listAfterSales(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListAfterSales`,
    method: 'post',
    data: {
      user_id: query.userId,
      order_no: query.orderNo,
      sales_no: query.salesNo,
      sales_status: query.salesStatus ?? -1,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.after_sales_list || [], total: res.total || 0 }))
}

export function listUserAfterSales(query = {}) {
  return request({
    url: `${base}/GetUserAfterSales`,
    method: 'post',
    data: {
      user_id: query.userId,
      sales_status: query.salesStatus ?? -1,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10
    }
  }).then(res => ({ rows: res.after_sales_list || [], total: res.total || 0 }))
}

export function getAfterSales(query) {
  const data = typeof query === 'object'
    ? { sales_no: query.salesNo || query.sales_no, sales_id: query.salesId || query.sales_id }
    : { sales_no: query }
  return request({
    url: `${base}/GetAfterSales`,
    method: 'post',
    data
  }).then(res => ({ data: res.after_sales, items: res.items || [] }))
}

export function addAfterSales(data) {
  return request({
    url: `${base}/CreateAfterSales`,
    method: 'post',
    data: {
      order_no: data.orderNo,
      user_id: data.userId,
      sales_type: data.salesType,
      sales_reason: data.salesReason,
      sales_desc: data.salesDesc,
      order_item_ids: data.orderItemIds || []
    }
  })
}

export function auditAfterSales(data) {
  return request({
    url: `${base}/AuditAfterSales`,
    method: 'post',
    data: {
      sales_no: data.salesNo,
      audit_status: data.auditStatus,
      audit_remark: data.auditRemark
    }
  })
}

export function refundAfterSales(salesNo) {
  return request({
    url: `${base}/Refund`,
    method: 'post',
    data: { sales_no: salesNo }
  })
}
