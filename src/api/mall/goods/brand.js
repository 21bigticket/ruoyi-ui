import request from '@/utils/request'

export function listBrand(query = {}) {
  return request({
    url: '/zebra-goods/brand.BrandService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      name_keyword: query.name || query.nameKeyword || '',
      status: query.status ?? -1
    }
  }).then(res => ({ rows: res.brands || [], total: res.total || 0 }))
}

export function getBrand(id) {
  return request({
    url: '/zebra-goods/brand.BrandService/Get',
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.brand }))
}

export function addBrand(data) {
  return request({
    url: '/zebra-goods/brand.BrandService/Create',
    method: 'post',
    data: {
      name: data.name,
      logo_url: data.logoUrl,
      description: data.description,
      sort_order: data.sortOrder || 0
    }
  })
}

export function updateBrand(data) {
  return request({
    url: '/zebra-goods/brand.BrandService/Update',
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      logo_url: data.logoUrl,
      description: data.description,
      sort_order: data.sortOrder,
      status: data.status
    }
  })
}

export function delBrand(id) {
  return request({
    url: '/zebra-goods/brand.BrandService/Delete',
    method: 'post',
    data: { id }
  })
}
