import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-pay/payment.PaymentService'

export function listPayment(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListPayments`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_id: query.userId,
      order_no: query.orderNo,
      pay_no: query.payNo,
      pay_type: query.payType || 0,
      pay_status: query.payStatus ?? -1,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.payments || [], total: res.total || 0 }))
}

export function getPayment(query) {
  const data = typeof query === 'object'
    ? { pay_no: query.payNo || query.pay_no, order_no: query.orderNo || query.order_no }
    : { pay_no: query }
  return request({
    url: `${base}/GetPayment`,
    method: 'post',
    data
  }).then(res => ({ data: res.payment }))
}

export function addPayment(data) {
  return request({
    url: `${base}/CreatePayment`,
    method: 'post',
    data: {
      order_no: data.orderNo,
      user_id: data.userId,
      pay_amount: data.payAmount,
      pay_type: data.payType,
      notify_url: data.notifyUrl,
      return_url: data.returnUrl
    }
  })
}

export function payCallback(data) {
  return request({
    url: `${base}/PayCallback`,
    method: 'post',
    data: {
      pay_no: data.payNo,
      third_party_no: data.thirdPartyNo,
      pay_status: data.payStatus
    }
  })
}

export function getRefund(query) {
  const data = typeof query === 'object'
    ? { refund_no: query.refundNo || query.refund_no, sales_no: query.salesNo || query.sales_no }
    : { refund_no: query }
  return request({
    url: `${base}/GetRefund`,
    method: 'post',
    data
  }).then(res => ({ data: res.refund, items: res.items || [] }))
}

export function listRefund(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListRefunds`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      pay_no: query.payNo,
      order_no: query.orderNo,
      refund_no: query.refundNo,
      refund_status: query.refundStatus ?? -1,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.refunds || [], total: res.total || 0 }))
}

export function addRefund(data) {
  return request({
    url: `${base}/CreateRefund`,
    method: 'post',
    data: {
      pay_no: data.payNo,
      sales_no: data.salesNo,
      refund_amount: data.refundAmount,
      refund_reason: data.refundReason,
      items: data.items || []
    }
  })
}

export function logPayment(data) {
  return request({
    url: `${base}/LogPayment`,
    method: 'post',
    data: {
      pay_no: data.payNo,
      order_no: data.orderNo,
      action: data.action,
      request_data: data.requestData,
      response_data: data.responseData
    }
  })
}

export function listPaymentLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListPaymentLogs`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      pay_no: query.payNo,
      order_no: query.orderNo,
      action: query.action,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.logs || [], total: res.total || 0 }))
}
