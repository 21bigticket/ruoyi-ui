import request from '@/utils/request'
import { extractTimeRange } from '@/api/mall/time'

const base = '/zebra-message/weixin.WeixinService'

export function listWeixinTemplate(query = {}) {
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

export function getWeixinTemplate(query) {
  const data = typeof query === 'object'
    ? { tpl_id: query.tplId || query.tpl_id, tpl_code: query.tplCode || query.tpl_code }
    : { tpl_id: query }
  return request({
    url: `${base}/GetTemplate`,
    method: 'post',
    data
  }).then(res => ({ data: res.template }))
}

export function addWeixinTemplate(data) {
  return request({
    url: `${base}/CreateTemplate`,
    method: 'post',
    data: {
      tpl_code: data.tplCode,
      tpl_name: data.tplName,
      tpl_id_weixin: data.tplIdWeixin,
      tpl_status: data.tplStatus
    }
  })
}

export function updateWeixinTemplate(data) {
  return request({
    url: `${base}/UpdateTemplate`,
    method: 'post',
    data: {
      tpl_id: data.tplId,
      tpl_name: data.tplName,
      tpl_id_weixin: data.tplIdWeixin,
      tpl_status: data.tplStatus
    }
  })
}

export function delWeixinTemplate(tplId) {
  return request({
    url: `${base}/DeleteTemplate`,
    method: 'post',
    data: { tpl_id: tplId }
  })
}

export function listWeixinLog(query = {}) {
  const timeRange = extractTimeRange(query)
  return request({
    url: `${base}/ListLogs`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      openid: query.openid,
      tpl_code: query.tplCode,
      status: query.status ?? -1,
      start_time: timeRange.start_time,
      end_time: timeRange.end_time
    }
  }).then(res => ({ rows: res.logs || [], total: res.total || 0 }))
}

export function sendWeixin(data) {
  return request({
    url: `${base}/SendWeixin`,
    method: 'post',
    data: {
      openid: data.openid,
      tpl_code: data.tplCode,
      data: data.data || {},
      page: data.page
    }
  })
}

export function batchSendWeixin(data) {
  return request({
    url: `${base}/BatchSendWeixin`,
    method: 'post',
    data: {
      openids: data.openids || [],
      tpl_code: data.tplCode,
      data: data.data || {},
      page: data.page
    }
  })
}
