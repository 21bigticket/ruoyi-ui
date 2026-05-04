import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      config_name: query.configName,
      config_key: query.configKey,
      config_type: query.configType,
      begin_time: query.params?.beginTime,
      end_time: query.params?.endTime
    }
  }).then(res => ({ rows: res.configs || [], total: res.total || 0 }))
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/Get',
    method: 'post',
    data: { config_id: configId }
  }).then(res => ({ data: res.config }))
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/GetByKey',
    method: 'post',
    data: { config_key: configKey }
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/Create',
    method: 'post',
    data: {
      config_name: data.configName,
      config_key: data.configKey,
      config_value: data.configValue,
      config_type: data.configType,
      remark: data.remark
    }
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/Update',
    method: 'post',
    data: {
      config_id: data.configId,
      config_name: data.configName,
      config_key: data.configKey,
      config_value: data.configValue,
      config_type: data.configType,
      remark: data.remark
    }
  })
}

// 删除参数配置
export function delConfig(configId) {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/Delete',
    method: 'post',
    data: { config_ids: Array.isArray(configId) ? configId : [configId] }
  })
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: '/zebra-passport/sys_config.SysConfigService/RefreshCache',
    method: 'post',
    data: {}
  })
}
