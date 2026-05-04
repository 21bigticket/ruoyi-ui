import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/zebra-passport/logininfor.LogininforService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_name: query.userName,
      ipaddr: query.ipaddr,
      status: query.status,
      begin_time: query.params?.beginTime,
      end_time: query.params?.endTime
    }
  }).then(res => ({ rows: res.infos || [], total: res.total || 0 }))
}

// 删除登录日志
export function delLogininfor(infoId) {
  return request({
    url: '/zebra-passport/logininfor.LogininforService/Delete',
    method: 'post',
    data: { info_ids: Array.isArray(infoId) ? infoId : [infoId] }
  })
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
  return request({
    url: '/zebra-passport/logininfor.LogininforService/Unlock',
    method: 'post',
    data: { user_name: userName }
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/zebra-passport/logininfor.LogininforService/Clean',
    method: 'post',
    data: {}
  })
}
