import request from '@/utils/request'

const base = '/zebra-member/member.MemberCollectService'

function normalizeMemberCollect(row = {}) {
  return {
    id: row.id ?? 0,
    userId: row.userId ?? row.user_id ?? 0,
    goodsId: row.goodsId ?? row.goods_id ?? 0,
    skuId: row.skuId ?? row.sku_id ?? 0,
    collectStatus: row.collectStatus ?? row.collect_status ?? 0,
    createTime: row.createTime ?? row.create_time ?? 0,
    updateTime: row.updateTime ?? row.update_time ?? 0
  }
}

export function listMemberCollect(userId) {
  return request({
    url: `${base}/GetListByUser`,
    method: 'post',
    data: { user_id: userId }
  }).then(res => {
    const collects = (res.collects || []).map(normalizeMemberCollect)
    return { rows: collects, total: collects.length }
  })
}

export function pageMemberCollect(query = {}) {
  return request({
    url: `${base}/List`,
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_id: query.userId,
      goods_id: query.goodsId,
      sku_id: query.skuId,
      collect_status: query.collectStatus ?? -1
    }
  }).then(res => ({
    rows: (res.collects || []).map(normalizeMemberCollect),
    total: res.total || 0
  }))
}

export function getMemberCollect(id) {
  return request({
    url: `${base}/Get`,
    method: 'post',
    data: { id }
  }).then(res => ({ data: normalizeMemberCollect(res.memberCollect || res.member_collect || {}) }))
}

export function addMemberCollect(data) {
  return request({
    url: `${base}/Create`,
    method: 'post',
    data: {
      user_id: data.userId,
      goods_id: data.goodsId,
      sku_id: data.skuId
    }
  })
}

export function updateMemberCollectStatus(id, collectStatus) {
  return request({
    url: `${base}/UpdateStatus`,
    method: 'post',
    data: { id, collect_status: collectStatus }
  })
}

export function delMemberCollect(id) {
  return request({
    url: `${base}/Delete`,
    method: 'post',
    data: { id }
  })
}

export function checkMemberCollectStatus(data) {
  return request({
    url: `${base}/CheckStatus`,
    method: 'post',
    data: {
      user_id: data.userId,
      goods_id: data.goodsId,
      sku_id: data.skuId
    }
  })
}
