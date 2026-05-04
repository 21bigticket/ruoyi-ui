import request from '@/utils/request'

function toStringArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value).split(',').map(item => item.trim()).filter(Boolean)
}

function toNumberArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.map(item => Number(item)).filter(Boolean)
  return String(value).split(',').map(item => Number(item.trim())).filter(Boolean)
}

export function listGoods(query = {}) {
  return request({
    url: '/zebra-goods/goods.GoodsService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      category_id: query.categoryId ?? -1,
      vendor_id: query.vendorId ?? -1,
      brand_id: query.brandId ?? -1,
      status: query.status ?? -1,
      name_keyword: query.name || query.nameKeyword || ''
    }
  }).then(res => ({ rows: res.goods || [], total: res.total || 0 }))
}

export function getGoods(id) {
  return request({
    url: '/zebra-goods/goods.GoodsService/Get',
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.goods }))
}

export function addGoods(data) {
  return request({
    url: '/zebra-goods/goods.GoodsService/Create',
    method: 'post',
    data: {
      category_id: data.categoryId,
      vendor_id: data.vendorId,
      brand_id: data.brandId,
      name: data.name,
      sub_title: data.subTitle,
      main_image: data.mainImage,
      detail: data.detail,
      sort_order: data.sortOrder || 0,
      gallery_images: toStringArray(data.galleryImages),
      attribute_template: toNumberArray(data.attributeTemplate),
      sku_name_rule: data.skuNameRule || ""
    }
  })
}

export function updateGoods(data) {
  return request({
    url: '/zebra-goods/goods.GoodsService/Update',
    method: 'post',
    data: {
      id: data.id,
      category_id: data.categoryId,
      vendor_id: data.vendorId,
      brand_id: data.brandId,
      name: data.name,
      sub_title: data.subTitle,
      main_image: data.mainImage,
      detail: data.detail,
      sort_order: data.sortOrder,
      status: data.status,
      gallery_images: toStringArray(data.galleryImages),
      attribute_template: toNumberArray(data.attributeTemplate),
      sku_name_rule: data.skuNameRule || ""
    }
  })
}

export function delGoods(id) {
  return request({
    url: '/zebra-goods/goods.GoodsService/Delete',
    method: 'post',
    data: { id }
  })
}
