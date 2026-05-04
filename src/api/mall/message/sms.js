import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-message/sms.SmsService'

export function listSmsTemplate(query = {}) {
  return request({
    url: `${base}/ListTemplates`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      tpl_status: query.tplStatus ?? -1
    }
  }).then(res => ({ rows: res.templates || [], total: res.total || 0 }))
}

export function getSmsTemplate(query) {
  const data = typeof query === 'object'
    ? { tpl_id: query.tplId || query.tpl_id, tpl_code: query.tplCode || query.tpl_code }
    : { tpl_id: query }
  return request({
    url: `${base}/GetTemplate`,
    method: 'post',
    data
  }).then(res => ({ data: res.template }))
}

export function addSmsTemplate(data) {
  return request({
    url: `${base}/CreateTemplate`,
    method: 'post',
    data: {
      tpl_code: data.tplCode,
      tpl_name: data.tplName,
      tpl_content: data.tplContent,
      tpl_status: data.tplStatus
    }
  })
}

export function updateSmsTemplate(data) {
  return request({
    url: `${base}/UpdateTemplate`,
    method: 'post',
    data: {
      tpl_id: data.tplId,
      tpl_name: data.tplName,
      tpl_content: data.tplContent,
      tpl_status: data.tplStatus
    }
  })
}

export function delSmsTemplate(tplId) {
  return request({
    url: `${base}/DeleteTemplate`,
    method: 'post',
    data: { tpl_id: tplId }
  })
}

export function listSmsLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListLogs`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      phone: query.phone,
      tpl_code: query.tplCode,
      status: query.status ?? -1,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.logs || [], total: res.total || 0 }))
}

export function sendSms(data) {
  return request({
    url: `${base}/SendSms`,
    method: 'post',
    data: {
      phone: data.phone,
      tpl_code: data.tplCode,
      params: data.params || {}
    }
  })
}

export function batchSendSms(data) {
  return request({
    url: `${base}/BatchSendSms`,
    method: 'post',
    data: {
      phones: data.phones || [],
      tpl_code: data.tplCode,
      params: data.params || {}
    }
  })
}
