import request from '@/utils/request'

export function listAttribute(query = {}) {
  return request({
    url: '/zebra-goods/attribute.AttributeService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      parent_id: query.parentId ?? -1,
      type: query.type ?? -1,
      status: query.status ?? -1
    }
  }).then(res => ({ rows: res.attributes || [], total: res.total || 0 }))
}

export function getAttribute(id) {
  return request({
    url: '/zebra-goods/attribute.AttributeService/Get',
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.attribute }))
}

export function addAttribute(data) {
  return request({
    url: '/zebra-goods/attribute.AttributeService/Create',
    method: 'post',
    data: {
      parent_id: data.parentId || 0,
      name: data.name,
      type: data.type,
      sort_order: data.sortOrder || 0
    }
  })
}

export function updateAttribute(data) {
  return request({
    url: '/zebra-goods/attribute.AttributeService/Update',
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      sort_order: data.sortOrder,
      status: data.status
    }
  })
}

export function delAttribute(id) {
  return request({
    url: '/zebra-goods/attribute.AttributeService/Delete',
    method: 'post',
    data: { id }
  })
}
