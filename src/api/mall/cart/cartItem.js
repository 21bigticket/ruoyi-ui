import request from '@/utils/request'

const base = '/zebra-cart/cart_item.CartItemService'

function normalizeCartItem(row = {}) {
  return {
    itemId: row.itemId ?? row.item_id ?? 0,
    cartId: row.cartId ?? row.cart_id ?? 0,
    userId: row.userId ?? row.user_id ?? 0,
    skuId: row.skuId ?? row.sku_id ?? 0,
    skuName: row.skuName ?? row.sku_name ?? '',
    skuImage: row.skuImage ?? row.sku_image ?? '',
    price: row.price ?? 0,
    quantity: row.quantity ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function listCartItem(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      cart_id: query.cartId,
      user_id: query.userId,
      sku_id: query.skuId
    }
  }).then(res => ({
    rows: (res.cartItems || res.cart_items || []).map(normalizeCartItem),
    total: res.total || 0
  }))
}

export function getCartItem(itemId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { item_id: itemId }
  }).then(res => ({ data: normalizeCartItem(res.cartItem || res.cart_item || {}) }))
}

export function addCartItemRecord(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      cart_id: data.cartId,
      user_id: data.userId,
      sku_id: data.skuId,
      sku_name: data.skuName,
      sku_image: data.skuImage,
      price: data.price,
      quantity: data.quantity
    }
  })
}

export function updateCartItemRecord(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      item_id: data.itemId,
      sku_id: data.skuId,
      sku_name: data.skuName,
      sku_image: data.skuImage,
      price: data.price,
      quantity: data.quantity
    }
  })
}

export function delCartItem(itemId) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { item_id: itemId }
  })
}

export function listUserCartItems(query = {}) {
  return request({
    url: `${base}/GetUserItems`,
    method: 'post',
    data: {
      user_id: query.userId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10
    }
  }).then(res => ({
    rows: (res.cartItems || res.cart_items || []).map(normalizeCartItem),
    total: res.total || 0
  }))
}

export function batchDeleteCartItems(itemIds) {
  return request({
    url: `${base}/BatchDelete`,
    method: 'post',
    data: { item_ids: itemIds }
  })
}
