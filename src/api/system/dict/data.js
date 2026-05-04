import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/zebra-passport/dict_data.DictDataService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      dict_type: query.dictType,
      dict_label: query.dictLabel,
      status: query.status
    }
  }).then(res => ({ rows: res.dictData || [], total: res.total || 0 }))
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/zebra-passport/dict_data.DictDataService/Get',
    method: 'post',
    data: { dict_code: dictCode }
  }).then(res => ({ data: res.dictData }))
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/zebra-passport/dict_data.DictDataService/GetByDictType',
    method: 'post',
    data: { dict_type: dictType }
  }).then(res => ({ data: res.dictData || [] }))
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/zebra-passport/dict_data.DictDataService/Create',
    method: 'post',
    data: {
      dict_type: data.dictType,
      dict_label: data.dictLabel,
      dict_value: data.dictValue,
      dict_sort: data.dictSort,
      css_class: data.cssClass,
      list_class: data.listClass,
      is_default: data.isDefault,
      status: data.status,
      remark: data.remark
    }
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/zebra-passport/dict_data.DictDataService/Update',
    method: 'post',
    data: {
      dict_code: data.dictCode,
      dict_type: data.dictType,
      dict_label: data.dictLabel,
      dict_value: data.dictValue,
      dict_sort: data.dictSort,
      css_class: data.cssClass,
      list_class: data.listClass,
      is_default: data.isDefault,
      status: data.status,
      remark: data.remark
    }
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/zebra-passport/dict_data.DictDataService/Delete',
    method: 'post',
    data: { dict_codes: Array.isArray(dictCode) ? dictCode : [dictCode] }
  })
}
