import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-activity/user_coupon.UserCouponService'

function normalizeUserCouponLog(row = {}) {
  return {
    logId: row.logId ?? row.log_id ?? 0,
    userCouponId: row.userCouponId ?? row.user_coupon_id ?? 0,
    userId: row.userId ?? row.user_id ?? 0,
    couponId: row.couponId ?? row.coupon_id ?? 0,
    action: row.action ?? '',
    orderNo: row.orderNo ?? row.order_no ?? '',
    beforeStatus: row.beforeStatus ?? row.before_status ?? 0,
    afterStatus: row.afterStatus ?? row.after_status ?? 0,
    result: row.result ?? '',
    message: row.message ?? '',
    requestData: row.requestData ?? row.request_data ?? '',
    responseData: row.responseData ?? row.response_data ?? '',
    createTime: row.createTime ?? row.create_time ?? 0
  }
}

export function listUserCouponLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListLogs`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_coupon_id: query.userCouponId,
      user_id: query.userId,
      coupon_id: query.couponId,
      order_no: query.orderNo,
      action: query.action,
      result: query.result,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({
    rows: (res.userCouponLogs || res.user_coupon_logs || []).map(normalizeUserCouponLog),
    total: res.total || 0
  }))
}

export function getUserCouponLog(logId) {
  return request({
    url: `${base}/GetLog`,
    method: 'post',
    data: { log_id: logId }
  }).then(res => ({ data: normalizeUserCouponLog(res.userCouponLog || res.user_coupon_log || {}) }))
}
