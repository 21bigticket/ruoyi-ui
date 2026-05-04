import request from '@/utils/request'
import { toUnixTimestamp } from '@/api/mall/time'

const base = '/zebra-activity/coupon.CouponService'

export function listCoupon(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      type: query.type ?? -1,
      status: query.status ?? -1
    }
  }).then(res => ({ rows: res.coupons || [], total: res.total || 0 }))
}

export function getCoupon(id) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.coupon }))
}

export function addCoupon(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      name: data.name,
      type: data.type,
      min_amount: data.minAmount,
      discount_amount: data.discountAmount,
      discount_rate: data.discountRate,
      total_quantity: data.totalQuantity,
      valid_days: data.validDays,
      start_time: toUnixTimestamp(data.startTime),
      end_time: toUnixTimestamp(data.endTime)
    }
  })
}

export function updateCoupon(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      min_amount: data.minAmount,
      discount_amount: data.discountAmount,
      discount_rate: data.discountRate,
      total_quantity: data.totalQuantity,
      valid_days: data.validDays,
      start_time: toUnixTimestamp(data.startTime),
      end_time: toUnixTimestamp(data.endTime),
      status: data.status
    }
  })
}

export function delCoupon(id) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { id }
  })
}
