import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      dict_name: query.dictName,
      dict_type: query.dictType,
      status: query.status,
      begin_time: query.params?.beginTime,
      end_time: query.params?.endTime
    }
  }).then(res => ({ rows: res.dictTypes || [], total: res.total || 0 }))
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/Get',
    method: 'post',
    data: { dict_id: dictId }
  }).then(res => ({ data: res.dictType }))
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/Create',
    method: 'post',
    data: {
      dict_name: data.dictName,
      dict_type: data.dictType,
      status: data.status,
      remark: data.remark
    }
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/Update',
    method: 'post',
    data: {
      dict_id: data.dictId,
      dict_name: data.dictName,
      dict_type: data.dictType,
      status: data.status,
      remark: data.remark
    }
  })
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/Delete',
    method: 'post',
    data: { dict_ids: Array.isArray(dictId) ? dictId : [dictId] }
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/RefreshCache',
    method: 'post',
    data: {}
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/zebra-passport/dict_type.DictTypeService/OptionSelect',
    method: 'post',
    data: {}
  }).then(res => ({ data: res.dictTypes || [] }))
}
