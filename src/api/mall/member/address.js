import request from '@/utils/request'

const base = '/zebra-member/member.MemberAddressService'

export function listMemberAddress(userId) {
  return request({
    url: `${base}/GetListByUser`,
    method: 'post',
    data: { user_id: userId }
  }).then(res => ({ rows: res.addresses || [], total: (res.addresses || []).length }))
}

export function pageMemberAddress(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_id: query.userId,
      address_status: query.addressStatus ?? -1
    }
  }).then(res => ({ rows: res.addresses || [], total: res.total || 0 }))
}

export function getMemberAddress(id) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { id }
  }).then(res => ({ data: res.member_address }))
}

export function addMemberAddress(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      user_id: data.userId,
      country: data.country,
      province: data.province,
      city: data.city,
      region: data.region,
      street: data.street
    }
  })
}

export function updateMemberAddress(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      id: data.id,
      country: data.country,
      province: data.province,
      city: data.city,
      region: data.region,
      street: data.street,
      address_status: data.addressStatus,
      default_option: data.defaultOption
    }
  })
}

export function delMemberAddress(id) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { id }
  })
}

export function setDefaultMemberAddress(id, userId) {
  return request({
    url: `${base}/SetDefault`,
    method: 'post',
    data: { id, user_id: userId }
  })
}
