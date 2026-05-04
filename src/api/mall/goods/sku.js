import request from '@/utils/request'

export function listSku(query = {}) {
  return request({
    url: '/zebra-goods/sku.SkuService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      goods_id: query.goodsId ?? -1,
      status: query.status ?? -1
    }
  }).then(res => ({ rows: res.skus || [], total: res.total || 0 }))
}

export function getSku(id) {
  return request({
    url: '/zebra-goods/sku.SkuService/Get',
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.sku }))
}

export function addSku(data) {
  return request({
    url: '/zebra-goods/sku.SkuService/Create',
    method: 'post',
    data: {
      goods_id: data.goodsId,
      sku_code: data.skuCode,
      name: data.name,
      price: data.price,
      image_url: data.imageUrl,
      sort_order: data.sortOrder || 0,
      specs: data.specs || '',
      stock_num: data.stockNum || 0
    }
  })
}

export function batchCreateSku(items = []) {
  return request({
    url: '/zebra-goods/sku.SkuService/BatchCreate',
    method: 'post',
    data: {
      items: items.map(item => ({
        goods_id: item.goodsId,
        sku_code: item.skuCode,
        name: item.name,
        price: item.price,
        image_url: item.imageUrl,
        sort_order: item.sortOrder || 0,
        specs: item.specs || '',
        stock_num: item.stockNum || 0
      }))
    }
  })
}

export function batchUpdateSku(items = []) {
  return request({
    url: '/zebra-goods/sku.SkuService/BatchUpdate',
    method: 'post',
    data: {
      items: items.map(item => ({
        id: item.id,
        price: item.price,
        stock_num: item.stockNum || 0,
        sort_order: item.sortOrder || 0,
        status: item.status ?? 1
      }))
    }
  })
}

export function updateSku(data) {
  return request({
    url: '/zebra-goods/sku.SkuService/Update',
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      price: data.price,
      image_url: data.imageUrl,
      sort_order: data.sortOrder,
      status: data.status,
      specs: data.specs || '',
      stock_num: data.stockNum || 0
    }
  })
}

export function delSku(id) {
  return request({
    url: '/zebra-goods/sku.SkuService/Delete',
    method: 'post',
    data: { id }
  })
}
