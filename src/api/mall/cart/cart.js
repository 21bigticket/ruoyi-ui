import request from '@/utils/request'

const base = '/zebra-cart/cart.CartService'

function normalizeCart(row = {}) {
  return {
    cartId: row.cartId ?? row.cart_id ?? 0,
    userId: row.userId ?? row.user_id ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function getCart(userId) {
  return request({
    url: `${base}/GetCart`,
    method: 'post',
    data: { user_id: userId }
  }).then(res => ({ data: normalizeCart(res.cart || {}), rows: res.items || [], total: (res.items || []).length }))
}

export function listCart(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_id: query.userId
    }
  }).then(res => ({
    rows: (res.carts || []).map(normalizeCart),
    total: res.total || 0
  }))
}

export function addCartItem(data) {
  return request({
    url: `${base}/AddItem`,
    method: 'post',
    data: {
      user_id: data.userId,
      sku_id: data.skuId,
      sku_name: data.skuName,
      sku_image: data.skuImage,
      price: data.price,
      quantity: data.quantity
    }
  })
}

export function removeCartItem(userId, itemId) {
  return request({
    url: `${base}/RemoveItem`,
    method: 'post',
    data: { user_id: userId, item_id: itemId }
  })
}

export function updateCartQuantity(data) {
  return request({
    url: `${base}/UpdateQuantity`,
    method: 'post',
    data: {
      user_id: data.userId,
      item_id: data.itemId,
      quantity: data.quantity
    }
  })
}

export function clearCart(userId) {
  return request({
    url: `${base}/ClearCart`,
    method: 'post',
    data: { user_id: userId }
  })
}

export function batchRemoveCartItems(userId, itemIds) {
  return request({
    url: `${base}/BatchRemove`,
    method: 'post',
    data: { user_id: userId, item_ids: itemIds }
  })
}
