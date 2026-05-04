import request from '@/utils/request'
import { toUnixTimestamp } from '@/api/mall/time'

const base = '/zebra-activity/activity.ActivityService'

export function listActivity(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      activity_type: query.activityType ?? -1,
      activity_status: query.activityStatus ?? -1
    }
  }).then(res => ({ rows: res.activities || [], total: res.total || 0 }))
}

export function getActivity(activityId) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { activity_id: activityId }
  }).then(res => ({ data: res.activity }))
}

export function addActivity(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      activity_name: data.activityName,
      activity_type: data.activityType,
      start_time: toUnixTimestamp(data.startTime),
      end_time: toUnixTimestamp(data.endTime),
      remark: data.remark
    }
  })
}

export function updateActivity(data) {
  return request({
    url: `${base}/Update`,
    method: 'post',
    data: {
      activity_id: data.activityId,
      activity_name: data.activityName,
      start_time: toUnixTimestamp(data.startTime),
      end_time: toUnixTimestamp(data.endTime),
      activity_status: data.activityStatus,
      remark: data.remark
    }
  })
}

export function delActivity(activityId) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { activity_id: activityId }
  })
}

export function startActivity(activityId) {
  return request({ url: `${base}/Start`, method: 'post', data: { activity_id: activityId } })
}

export function endActivity(activityId) {
  return request({ url: `${base}/End`, method: 'post', data: { activity_id: activityId } })
}

export function cancelActivity(activityId) {
  return request({ url: `${base}/Cancel`, method: 'post', data: { activity_id: activityId } })
}
