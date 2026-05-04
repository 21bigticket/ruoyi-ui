import request from '@/utils/request'

export function listCategory(query = {}) {
  return request({
    url: '/zebra-goods/category.CategoryService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      parent_id: query.parentId ?? -1,
      level: query.level ?? -1,
      status: query.status ?? -1
    }
  }).then(res => ({ rows: res.categories || [], total: res.total || 0 }))
}

export function getCategory(id) {
  return request({
    url: '/zebra-goods/category.CategoryService/Get',
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.category }))
}

export function getCategoryTree(parentId = -1) {
  return request({
    url: '/zebra-goods/category.CategoryService/GetTree',
    method: 'post',
    data: { parent_id: parentId }
  }).then(res => ({ data: res.tree || [] }))
}

export function addCategory(data) {
  return request({
    url: '/zebra-goods/category.CategoryService/Create',
    method: 'post',
    data: {
      parent_id: data.parentId || 0,
      name: data.name,
      icon_url: data.iconUrl,
      sort_order: data.sortOrder || 0
    }
  })
}

export function updateCategory(data) {
  return request({
    url: '/zebra-goods/category.CategoryService/Update',
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      icon_url: data.iconUrl,
      sort_order: data.sortOrder,
      status: data.status
    }
  })
}

export function delCategory(id) {
  return request({
    url: '/zebra-goods/category.CategoryService/Delete',
    method: 'post',
    data: { id }
  })
}
