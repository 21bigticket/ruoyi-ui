import request from '@/utils/request'

const base = '/zebra-member/member.MemberService'

export function listMember(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      name_keyword: query.name || query.nameKeyword || '',
      member_status: query.memberStatus ?? -1
    }
  }).then(res => ({ rows: res.members || [], total: res.total || 0 }))
}

export function getMember(query) {
  const data = typeof query === 'object'
    ? {
        user_id: query.userId || query.user_id,
        user_name: query.userName || query.user_name,
        phone: query.phone
      }
    : { user_id: query }
  return request({
    url: `${base}/Get`,
    method: 'post',
    data
  }).then(res => ({ data: res.member }))
}

export function addMember(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      user_name: data.userName,
      password: data.password,
      zb_lion: data.zbLion,
      nick_name: data.nickName,
      head_url: data.headUrl,
      phone: data.phone,
      email: data.email
    }
  })
}

export function updateMember(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      user_id: data.userId,
      nick_name: data.nickName,
      head_url: data.headUrl,
      member_status: data.memberStatus
    }
  })
}

export function delMember(userId) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { user_id: userId }
  })
}
