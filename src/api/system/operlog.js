import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/zebra-passport/oper_log.OperLogService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      title: query.title,
      business_type: query.businessType,
      oper_name: query.operName,
      status: query.status,
      begin_time: query.params?.beginTime,
      end_time: query.params?.endTime
    }
  }).then(res => ({ rows: res.logs || [], total: res.total || 0 }))
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/zebra-passport/oper_log.OperLogService/Delete',
    method: 'post',
    data: { oper_ids: Array.isArray(operId) ? operId : [operId] }
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/zebra-passport/oper_log.OperLogService/Clean',
    method: 'post',
    data: {}
  })
}
