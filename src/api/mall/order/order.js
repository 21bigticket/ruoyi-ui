import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-order/order.OrderService'

export function listOrder(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListOrders`,
    method: 'post',
    data: {
      user_id: query.userId,
      order_no: query.orderNo,
      order_status: query.orderStatus ?? -1,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.orders || [], total: res.total || 0 }))
}

export function listUserOrder(query = {}) {
  return request({
    url: `${base}/GetUserOrders`,
    method: 'post',
    data: {
      user_id: query.userId,
      order_status: query.orderStatus ?? -1,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10
    }
  }).then(res => ({ rows: res.orders || [], total: res.total || 0 }))
}

export function getOrder(query) {
  const data = typeof query === 'object'
    ? { order_no: query.orderNo || query.order_no, order_id: query.orderId || query.order_id }
    : { order_no: query }
  return request({
    url: `${base}/GetOrder`,
    method: 'post',
    data
  }).then(res => ({ data: res.order, items: res.items || [], delivery: res.delivery }))
}

export function addOrder(data) {
  return request({
    url: `${base}/CreateOrder`,
    method: 'post',
    data: {
      user_id: data.userId,
      items: data.items || [],
      coupon_id: data.couponId,
      activity_id: data.activityId,
      receiver_name: data.receiverName,
      receiver_phone: data.receiverPhone,
      receiver_address: data.receiverAddress,
      selected_item_ids: data.selectedItemIds || []
    }
  })
}

export function cancelOrder(orderNo, userId) {
  return request({
    url: `${base}/CancelOrder`,
    method: 'post',
    data: { order_no: orderNo, user_id: userId }
  })
}

export function payOrder(orderNo, userId) {
  return request({
    url: `${base}/PayOrder`,
    method: 'post',
    data: { order_no: orderNo, user_id: userId }
  })
}

export function deliverOrder(data) {
  return request({
    url: `${base}/DeliverOrder`,
    method: 'post',
    data: {
      order_no: data.orderNo,
      delivery_no: data.deliveryNo,
      delivery_comp: data.deliveryComp
    }
  })
}

export function finishOrder(orderNo) {
  return request({
    url: `${base}/FinishOrder`,
    method: 'post',
    data: { order_no: orderNo }
  })
}
