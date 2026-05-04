import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-order/delivery.DeliveryService'

export function getDelivery(query) {
  const data = typeof query === 'object'
    ? {
        order_no: query.orderNo || query.order_no,
        delivery_no: query.deliveryNo || query.delivery_no,
        delivery_id: query.deliveryId || query.delivery_id
      }
    : { order_no: query }
  return request({
    url: `${base}/GetDelivery`,
    method: 'post',
    data
  }).then(res => ({ data: res.delivery }))
}

export function addDelivery(data) {
  return request({
    url: `${base}/CreateDelivery`,
    method: 'post',
    data: {
      order_no: data.orderNo,
      delivery_no: data.deliveryNo,
      delivery_comp: data.deliveryComp
    }
  })
}

export function listDeliveries(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListDeliveries`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      order_no: query.orderNo,
      delivery_no: query.deliveryNo,
      delivery_comp: query.deliveryComp,
      delivery_status: query.deliveryStatus ?? -1,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.deliveries || [], total: res.total || 0 }))
}

export function updateDeliveryStatus(orderNo, deliveryStatus) {
  return request({
    url: `${base}/UpdateDeliveryStatus`,
    method: 'post',
    data: { order_no: orderNo, delivery_status: deliveryStatus }
  })
}
