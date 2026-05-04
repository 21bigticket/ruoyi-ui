import request from '@/utils/request'

const base = '/zebra-member/member.MemberItemService'

function normalizeMemberItem(row = {}) {
  return {
    id: row.id ?? 0,
    userId: row.userId ?? row.user_id ?? 0,
    gender: row.gender ?? 0,
    age: row.age ?? 0,
    birthday: row.birthday ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function getMemberItem(userId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { user_id: userId }
  }).then(res => ({ data: normalizeMemberItem(res.memberItem || res.member_item || {}) }))
}

export function addMemberItem(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      user_id: data.userId,
      gender: data.gender,
      age: data.age,
      birthday: data.birthday
    }
  })
}

export function updateMemberItem(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      id: data.id,
      gender: data.gender,
      age: data.age,
      birthday: data.birthday
    }
  })
}
