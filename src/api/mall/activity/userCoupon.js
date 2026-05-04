import request from '@/utils/request'

const base = '/zebra-activity/user_coupon.UserCouponService'

function normalizeUserCoupon(row = {}) {
  return {
    userCouponId: row.userCouponId ?? row.user_coupon_id ?? 0,
    userId: row.userId ?? row.user_id ?? 0,
    couponId: row.couponId ?? row.coupon_id ?? 0,
    couponStatus: row.couponStatus ?? row.coupon_status ?? 0,
    orderNo: row.orderNo ?? row.order_no ?? '',
    receiveTime: row.receiveTime ?? row.receive_time ?? 0,
    useTime: row.useTime ?? row.use_time ?? 0,
    expireTime: row.expireTime ?? row.expire_time ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function listUserCoupon(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      user_id: query.userId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      coupon_status: query.couponStatus ?? -1
    }
  }).then(res => ({
    rows: (res.userCoupons || res.user_coupons || []).map(normalizeUserCoupon),
    total: res.total || 0
  }))
}

export function getUserCoupon(userCouponId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { user_coupon_id: userCouponId }
  }).then(res => ({ data: normalizeUserCoupon(res.userCoupon || res.user_coupon || {}) }))
}

export function receiveCoupon(data) {
  return request({
    url: `${base}/Receive`,
    method: 'post',
    data: {
      user_id: data.userId,
      coupon_id: data.couponId
    }
  })
}

export function useCoupon(data) {
  return request({
    url: `${base}/Use`,
    method: 'post',
    data: {
      user_coupon_id: data.userCouponId,
      user_id: data.userId,
      order_no: data.orderNo
    }
  })
}

export function getAvailableCoupons(data) {
  return request({
    url: `${base}/GetAvailable`,
    method: 'post',
    data: {
      user_id: data.userId,
      order_amount: data.orderAmount
    }
  }).then(res => {
    const coupons = (res.userCoupons || res.user_coupons || []).map(normalizeUserCoupon)
    return { rows: coupons, total: coupons.length }
  })
}
