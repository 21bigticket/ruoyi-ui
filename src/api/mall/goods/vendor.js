import request from '@/utils/request'

export function listVendor(query = {}) {
  return request({
    url: '/zebra-goods/vendor.VendorService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      name_keyword: query.name || query.nameKeyword || '',
      status: query.status ?? -1
    }
  }).then(res => ({ rows: res.vendors || [], total: res.total || 0 }))
}

export function getVendor(id) {
  return request({
    url: '/zebra-goods/vendor.VendorService/Get',
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.vendor }))
}

export function addVendor(data) {
  return request({
    url: '/zebra-goods/vendor.VendorService/Create',
    method: 'post',
    data: {
      name: data.name,
      code: data.code,
      contact: data.contact,
      phone: data.phone,
      email: data.email,
      address: data.address
    }
  })
}

export function updateVendor(data) {
  return request({
    url: '/zebra-goods/vendor.VendorService/Update',
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      contact: data.contact,
      phone: data.phone,
      email: data.email,
      address: data.address,
      status: data.status
    }
  })
}

export function delVendor(id) {
  return request({
    url: '/zebra-goods/vendor.VendorService/Delete',
    method: 'post',
    data: { id }
  })
}
